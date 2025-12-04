import { Router, Response } from "express";
import { prisma } from "../config/prisma.js";
import { requireAuth, AuthedRequest } from "../middlewares/auth.js";
import { z } from "zod";
import { formatValidationError } from "../utils/errorFormatter.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const router = Router();

/**
 * Schema for creating a conversation
 */
const createConversationSchema = z.object({
  otherUserId: z.coerce.number().int().positive(),
  requestId: z.coerce.number().int().positive().optional()
});

/**
 * Schema for sending a message
 */
const sendMessageSchema = z.object({
  conversationId: z.number().int().positive(),
  content: z.string().min(1)
});

/**
 * Conversation include options for Prisma queries
 */
const conversationInclude = {
  user1: { select: { id: true, name: true, email: true } },
  user2: { select: { id: true, name: true, email: true } },
  request: {
    select: {
      id: true,
      title: true,
      category: { select: { id: true, name: true, icon: true } }
    }
  }
};

/**
 * Finds an existing conversation between two users
 */
async function findConversation(
  user1Id: number, 
  user2Id: number, 
  requestId?: number
) {
  if (requestId) {
    const conv = await prisma.conversation.findFirst({
      where: { user1Id, user2Id, requestId },
      include: conversationInclude
    });
    if (conv) return conv;
  }

  return await prisma.conversation.findFirst({
    where: { user1Id, user2Id },
    include: conversationInclude
  });
}

/**
 * Creates a new conversation between two users
 */
async function createConversation(
  user1Id: number, 
  user2Id: number, 
  requestId?: number
) {
  return await prisma.conversation.create({
    data: { user1Id, user2Id, requestId: requestId || null },
    include: conversationInclude
  });
}

/**
 * Formats a conversation with other user info and last message
 */
function formatConversation(conv: any, userId: number) {
  const otherUser = conv.user1Id === userId ? conv.user2 : conv.user1;
  const lastMessage = conv.messages[0] || null;
  
  return {
    id: conv.id,
    otherUser,
    request: conv.request,
    lastMessage: lastMessage ? {
      content: lastMessage.content,
      senderId: lastMessage.senderId,
      senderName: lastMessage.sender.name,
      createdAt: lastMessage.createdAt,
      read: lastMessage.read
    } : null,
    unreadCount: 0,
    updatedAt: conv.updatedAt
  };
}

/**
 * Calculates unread message count for a conversation
 */
async function getUnreadCount(conversationId: number, userId: number) {
  return await prisma.message.count({
    where: {
      conversationId,
      receiverId: userId,
      read: false
    }
  });
}

/**
 * GET /api/chat/conversations
 * Get all conversations for the current user (requires authentication)
 */
router.get("/conversations", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      },
      include: {
        user1: { select: { id: true, name: true, email: true } },
        user2: { select: { id: true, name: true, email: true } },
        request: {
          select: {
            id: true,
            title: true,
            category: { select: { id: true, name: true, icon: true } }
          }
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            sender: { select: { id: true, name: true } }
          }
        }
      },
      orderBy: { updatedAt: "desc" }
    });

    const formatted = conversations.map(conv => formatConversation(conv, userId));

    for (const conv of formatted) {
      conv.unreadCount = await getUnreadCount(conv.id, userId);
    }

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

/**
 * POST /api/chat/conversations
 * Get or create a conversation between two users (requires authentication)
 */
router.post("/conversations", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    console.log("Creating conversation - userId:", userId, "body:", req.body);
    const parse = createConversationSchema.safeParse(req.body);
    
    if (!parse.success) {
      console.error("Validation error:", parse.error);
      res.status(400).json({ error: formatValidationError(parse.error) });
      return;
    }

    const { otherUserId, requestId } = parse.data;
    console.log("Parsed data - otherUserId:", otherUserId, "requestId:", requestId);

    if (otherUserId === userId) {
      res.status(400).json({ error: "Cannot create conversation with yourself" });
      return;
    }

    const otherUser = await prisma.user.findUnique({ where: { id: otherUserId } });
    if (!otherUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (requestId) {
      const request = await prisma.borrowRequest.findUnique({ where: { id: requestId } });
      if (!request) {
        res.status(404).json({ error: "Request not found" });
        return;
      }
    }

    const user1Id = Math.min(userId, otherUserId);
    const user2Id = Math.max(userId, otherUserId);

    let conversation = await findConversation(user1Id, user2Id, requestId);

    if (!conversation) {
      try {
        conversation = await createConversation(user1Id, user2Id, requestId);
      } catch (createError: unknown) {
        if (createError instanceof PrismaClientKnownRequestError && createError.code === "P2002") {
          conversation = await findConversation(user1Id, user2Id);
          if (conversation && requestId) {
            conversation = await prisma.conversation.update({
              where: { id: conversation.id },
              data: { requestId },
              include: conversationInclude
            });
          }
        } else {
          throw createError;
        }
      }
    } else if (requestId && !conversation.requestId) {
      conversation = await prisma.conversation.update({
        where: { id: conversation.id },
        data: { requestId },
        include: conversationInclude
      });
    }

    if (!conversation) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    const otherUserInfo = conversation.user1Id === userId ? conversation.user2 : conversation.user1;

    res.json({
      id: conversation.id,
      otherUser: otherUserInfo,
      request: conversation.request,
      createdAt: conversation.createdAt
    });
  } catch (error: unknown) {
    console.error("Error creating conversation:", error);
    const message = error instanceof Error ? error.message : "Failed to create conversation";
    res.status(500).json({ error: message });
  }
});

/**
 * GET /api/chat/conversations/:id/messages
 * Get all messages for a conversation (requires authentication)
 */
router.get("/conversations/:id/messages", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const conversationId = Number(req.params.id);
    const userId = req.userId!;

    if (isNaN(conversationId)) {
      res.status(400).json({ error: "Invalid conversation ID" });
      return;
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        user1: { select: { id: true, name: true } },
        user2: { select: { id: true, name: true } }
      }
    });

    if (!conversation) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: "asc" }
    });

    await prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: userId,
        read: false
      },
      data: { read: true }
    });

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

/**
 * POST /api/chat/messages
 * Send a message in a conversation (requires authentication)
 */
router.post("/messages", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const parse = sendMessageSchema.safeParse(req.body);
    
    if (!parse.success) {
      res.status(400).json({ error: formatValidationError(parse.error) });
      return;
    }

    const { conversationId, content } = parse.data;

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        user1: { select: { id: true } },
        user2: { select: { id: true } }
      }
    });

    if (!conversation) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const receiverId = conversation.user1Id === userId ? conversation.user2Id : conversation.user1Id;

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        receiverId,
        content: content.trim()
      },
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } }
      }
    });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });

    res.status(201).json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
