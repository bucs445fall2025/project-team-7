<<<<<<< HEAD
import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { requireAuth, AuthedRequest } from "../middlewares/auth.js";
import { z } from "zod";
import { formatValidationError } from "../utils/errorFormatter.js";
=======
import { Router, Response } from "express";
import { prisma } from "../config/prisma.js";
import { requireAuth, AuthedRequest } from "../middlewares/auth.js";
import { z } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c

const router = Router();

/**
<<<<<<< HEAD
 * Schema for creating a conversation
=======
 * Zod schema for conversation creation validation
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
 */
const createConversationSchema = z.object({
  otherUserId: z.number().int().positive(),
  requestId: z.number().int().positive().optional()
});

/**
<<<<<<< HEAD
 * Schema for sending a message
=======
 * Zod schema for message sending validation
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
 */
const sendMessageSchema = z.object({
  conversationId: z.number().int().positive(),
  content: z.string().min(1)
});

/**
<<<<<<< HEAD
 * GET /api/chat/conversations
 * Get all conversations for the current user (requires authentication)
 * 
 * @returns Array of conversations with other user info, last message, and unread counts
 */
router.get("/conversations", requireAuth, async (req: AuthedRequest, res) => {
=======
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
 * 
 * @param user1Id - First user ID (must be < user2Id)
 * @param user2Id - Second user ID (must be > user1Id)
 * @param requestId - Optional request ID to filter by
 * @returns Conversation object or null if not found
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
 * 
 * @param user1Id - First user ID (must be < user2Id)
 * @param user2Id - Second user ID (must be > user1Id)
 * @param requestId - Optional request ID to link
 * @returns Created conversation object
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
 * 
 * @param conv - Conversation object from database
 * @param userId - Current user ID
 * @returns Formatted conversation object
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
 * 
 * @param conversationId - Conversation ID
 * @param userId - Current user ID
 * @returns Number of unread messages
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
 * Retrieves all conversations for the current user
 * 
 * @param req - Express request object (requires authentication)
 * @param res - Express response object
 * @returns JSON array of conversations with other user info and last message
 */
router.get("/conversations", requireAuth, async (req: AuthedRequest, res: Response) => {
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
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

<<<<<<< HEAD
    const formatted = conversations.map((conv: typeof conversations[0]) => {
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
    });

    for (const conv of formatted) {
      const unread = await prisma.message.count({
        where: {
          conversationId: conv.id,
          receiverId: userId,
          read: false
        }
      });
      conv.unreadCount = unread;
=======
    const formatted = conversations.map(conv => formatConversation(conv, userId));

    for (const conv of formatted) {
      conv.unreadCount = await getUnreadCount(conv.id, userId);
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
    }

    res.json(formatted);
  } catch (error) {
<<<<<<< HEAD
=======
    console.error("Error fetching conversations:", error);
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

/**
 * POST /api/chat/conversations
<<<<<<< HEAD
 * Get or create a conversation between two users (requires authentication)
 * Optionally links conversation to a borrow request
 * 
 * @param req.body - Conversation data (otherUserId, requestId optional)
 * @returns Conversation details with other user info
 */
router.post("/conversations", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const userId = req.userId!;
    const parse = createConversationSchema.safeParse(req.body);
    
    if (!parse.success) {
      res.status(400).json({ error: formatValidationError(parse.error) });
      return;
=======
 * Gets or creates a conversation between two users
 * 
 * @param req - Express request object with otherUserId and optional requestId (requires authentication)
 * @param res - Express response object
 * @returns JSON object with conversation data or 400/404/500 error
 */
router.post("/conversations", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    
    const parse = createConversationSchema.safeParse(req.body);
    if (!parse.success) {
      const errors = parse.error.flatten();
      const errorMessage = errors.formErrors?.[0] || 
        Object.values(errors.fieldErrors || {}).flat()[0] || 
        "Invalid request data";
      return res.status(400).json({ error: errorMessage });
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
    }

    const { otherUserId, requestId } = parse.data;

    if (otherUserId === userId) {
<<<<<<< HEAD
      res.status(400).json({ error: "Cannot create conversation with yourself" });
      return;
=======
      return res.status(400).json({ error: "Cannot create conversation with yourself" });
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
    }

    const otherUser = await prisma.user.findUnique({ where: { id: otherUserId } });
    if (!otherUser) {
<<<<<<< HEAD
      res.status(404).json({ error: "User not found" });
      return;
=======
      return res.status(404).json({ error: "User not found" });
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
    }

    if (requestId) {
      const request = await prisma.borrowRequest.findUnique({ where: { id: requestId } });
      if (!request) {
<<<<<<< HEAD
        res.status(404).json({ error: "Request not found" });
        return;
=======
        return res.status(404).json({ error: "Request not found" });
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
      }
    }

    const user1Id = Math.min(userId, otherUserId);
    const user2Id = Math.max(userId, otherUserId);
<<<<<<< HEAD
    
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
    
    let conversation = await prisma.conversation.findFirst({
      where: {
        user1Id,
        user2Id,
        ...(requestId ? { requestId } : {})
      },
      include: conversationInclude
    });

    if (!conversation) {
      conversation = await prisma.conversation.findFirst({
        where: { user1Id, user2Id },
        include: conversationInclude
      });
    }

    if (!conversation) {
      try {
        conversation = await prisma.conversation.create({
          data: {
            user1Id,
            user2Id,
            requestId: requestId || null
          },
          include: conversationInclude
        });
      } catch (createError: any) {
        if (createError.code === "P2002") {
          conversation = await prisma.conversation.findFirst({
            where: { user1Id, user2Id },
            include: conversationInclude
          });
=======

    let conversation = await findConversation(user1Id, user2Id, requestId);

    if (!conversation) {
      try {
        conversation = await createConversation(user1Id, user2Id, requestId);
      } catch (createError: unknown) {
        if (createError instanceof PrismaClientKnownRequestError && createError.code === "P2002") {
          conversation = await findConversation(user1Id, user2Id);
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
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

<<<<<<< HEAD
    const otherUserInfo = conversation.user1Id === userId 
      ? conversation.user2 
      : conversation.user1;
=======
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const otherUserInfo = conversation.user1Id === userId ? conversation.user2 : conversation.user1;
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c

    res.json({
      id: conversation.id,
      otherUser: otherUserInfo,
      request: conversation.request,
      createdAt: conversation.createdAt
    });
<<<<<<< HEAD
  } catch (error: any) {
    res.status(500).json({ 
      error: error.message || "Failed to create conversation" 
    });
=======
  } catch (error: unknown) {
    console.error("Error creating conversation:", error);
    const message = error instanceof Error ? error.message : "Failed to create conversation";
    res.status(500).json({ error: message });
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
  }
});

/**
 * GET /api/chat/conversations/:id/messages
<<<<<<< HEAD
 * Get all messages for a conversation (requires authentication)
 * Marks messages as read for the current user
 * 
 * @param id - Conversation ID from URL parameters
 * @returns Array of messages in the conversation
 */
router.get("/conversations/:id/messages", requireAuth, async (req: AuthedRequest, res) => {
=======
 * Retrieves all messages for a conversation
 * 
 * @param req - Express request object with conversation ID in params (requires authentication)
 * @param res - Express response object
 * @returns JSON array of messages or 403/404/500 error
 */
router.get("/conversations/:id/messages", requireAuth, async (req: AuthedRequest, res: Response) => {
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
  try {
    const conversationId = Number(req.params.id);
    const userId = req.userId!;

<<<<<<< HEAD
=======
    if (isNaN(conversationId)) {
      return res.status(400).json({ error: "Invalid conversation ID" });
    }

>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        user1: { select: { id: true, name: true } },
        user2: { select: { id: true, name: true } }
      }
    });

    if (!conversation) {
<<<<<<< HEAD
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
=======
      return res.status(404).json({ error: "Conversation not found" });
    }

    if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
      return res.status(403).json({ error: "Forbidden" });
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
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
<<<<<<< HEAD
=======
    console.error("Error fetching messages:", error);
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

/**
 * POST /api/chat/messages
<<<<<<< HEAD
 * Send a message in a conversation (requires authentication)
 * 
 * @param req.body - Message data (conversationId, content)
 * @returns Created message
 */
router.post("/messages", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const userId = req.userId!;
    const parse = sendMessageSchema.safeParse(req.body);
    
    if (!parse.success) {
      res.status(400).json({ error: formatValidationError(parse.error) });
      return;
=======
 * Sends a message in a conversation
 * 
 * @param req - Express request object with message data in body (requires authentication)
 * @param res - Express response object
 * @returns JSON object with created message or 400/403/404/500 error
 */
router.post("/messages", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const parse = sendMessageSchema.safeParse(req.body);
    if (!parse.success) {
      const errors = parse.error.flatten();
      const errorMessage = errors.formErrors?.[0] || 
        Object.values(errors.fieldErrors || {}).flat()[0] || 
        "Invalid request data";
      return res.status(400).json({ error: errorMessage });
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
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
<<<<<<< HEAD
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const receiverId = conversation.user1Id === userId 
      ? conversation.user2Id 
      : conversation.user1Id;
=======
      return res.status(404).json({ error: "Conversation not found" });
    }

    if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const receiverId = conversation.user1Id === userId ? conversation.user2Id : conversation.user1Id;
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c

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
<<<<<<< HEAD
=======
    console.error("Error sending message:", error);
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
