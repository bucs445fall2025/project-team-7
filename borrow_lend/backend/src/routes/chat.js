"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var prisma_js_1 = require("../config/prisma.js");
var auth_js_1 = require("../middlewares/auth.js");
var zod_1 = require("zod");
var library_1 = require("@prisma/client/runtime/library");
var router = (0, express_1.Router)();
/**
 * Zod schema for conversation creation validation
 */
var createConversationSchema = zod_1.z.object({
    otherUserId: zod_1.z.number().int().positive(),
    requestId: zod_1.z.number().int().positive().optional()
});
/**
 * Zod schema for message sending validation
 */
var sendMessageSchema = zod_1.z.object({
    conversationId: zod_1.z.number().int().positive(),
    content: zod_1.z.string().min(1)
});
/**
 * Conversation include options for Prisma queries
 */
var conversationInclude = {
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
function findConversation(user1Id, user2Id, requestId) {
    return __awaiter(this, void 0, void 0, function () {
        var conv;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!requestId) return [3 /*break*/, 2];
                    return [4 /*yield*/, prisma_js_1.prisma.conversation.findFirst({
                            where: { user1Id: user1Id, user2Id: user2Id, requestId: requestId },
                            include: conversationInclude
                        })];
                case 1:
                    conv = _a.sent();
                    if (conv)
                        return [2 /*return*/, conv];
                    _a.label = 2;
                case 2: return [4 /*yield*/, prisma_js_1.prisma.conversation.findFirst({
                        where: { user1Id: user1Id, user2Id: user2Id },
                        include: conversationInclude
                    })];
                case 3: return [2 /*return*/, _a.sent()];
            }
        });
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
function createConversation(user1Id, user2Id, requestId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma_js_1.prisma.conversation.create({
                        data: { user1Id: user1Id, user2Id: user2Id, requestId: requestId || null },
                        include: conversationInclude
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/**
 * Formats a conversation with other user info and last message
 *
 * @param conv - Conversation object from database
 * @param userId - Current user ID
 * @returns Formatted conversation object
 */
function formatConversation(conv, userId) {
    var otherUser = conv.user1Id === userId ? conv.user2 : conv.user1;
    var lastMessage = conv.messages[0] || null;
    return {
        id: conv.id,
        otherUser: otherUser,
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
function getUnreadCount(conversationId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma_js_1.prisma.message.count({
                        where: {
                            conversationId: conversationId,
                            receiverId: userId,
                            read: false
                        }
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
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
router.get("/conversations", auth_js_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId_1, conversations, formatted, _i, formatted_1, conv, _a, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                userId_1 = req.userId;
                return [4 /*yield*/, prisma_js_1.prisma.conversation.findMany({
                        where: {
                            OR: [
                                { user1Id: userId_1 },
                                { user2Id: userId_1 }
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
                    })];
            case 1:
                conversations = _b.sent();
                formatted = conversations.map(function (conv) { return formatConversation(conv, userId_1); });
                _i = 0, formatted_1 = formatted;
                _b.label = 2;
            case 2:
                if (!(_i < formatted_1.length)) return [3 /*break*/, 5];
                conv = formatted_1[_i];
                _a = conv;
                return [4 /*yield*/, getUnreadCount(conv.id, userId_1)];
            case 3:
                _a.unreadCount = _b.sent();
                _b.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                res.json(formatted);
                return [3 /*break*/, 7];
            case 6:
                error_1 = _b.sent();
                console.error("Error fetching conversations:", error_1);
                res.status(500).json({ error: "Failed to fetch conversations" });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
/**
 * POST /api/chat/conversations
 * Gets or creates a conversation between two users
 *
 * @param req - Express request object with otherUserId and optional requestId (requires authentication)
 * @param res - Express response object
 * @returns JSON object with conversation data or 400/404/500 error
 */
router.post("/conversations", auth_js_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, parse, errors, errorMessage, _a, otherUserId, requestId, otherUser, request, user1Id, user2Id, conversation, createError_1, otherUserInfo, error_2, message;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 17, , 18]);
                userId = req.userId;
                parse = createConversationSchema.safeParse(req.body);
                if (!parse.success) {
                    errors = parse.error.flatten();
                    errorMessage = ((_b = errors.formErrors) === null || _b === void 0 ? void 0 : _b[0]) ||
                        Object.values(errors.fieldErrors || {}).flat()[0] ||
                        "Invalid request data";
                    return [2 /*return*/, res.status(400).json({ error: errorMessage })];
                }
                _a = parse.data, otherUserId = _a.otherUserId, requestId = _a.requestId;
                if (otherUserId === userId) {
                    return [2 /*return*/, res.status(400).json({ error: "Cannot create conversation with yourself" })];
                }
                return [4 /*yield*/, prisma_js_1.prisma.user.findUnique({ where: { id: otherUserId } })];
            case 1:
                otherUser = _c.sent();
                if (!otherUser) {
                    return [2 /*return*/, res.status(404).json({ error: "User not found" })];
                }
                if (!requestId) return [3 /*break*/, 3];
                return [4 /*yield*/, prisma_js_1.prisma.borrowRequest.findUnique({ where: { id: requestId } })];
            case 2:
                request = _c.sent();
                if (!request) {
                    return [2 /*return*/, res.status(404).json({ error: "Request not found" })];
                }
                _c.label = 3;
            case 3:
                user1Id = Math.min(userId, otherUserId);
                user2Id = Math.max(userId, otherUserId);
                return [4 /*yield*/, findConversation(user1Id, user2Id, requestId)];
            case 4:
                conversation = _c.sent();
                if (!!conversation) return [3 /*break*/, 14];
                _c.label = 5;
            case 5:
                _c.trys.push([5, 7, , 13]);
                return [4 /*yield*/, createConversation(user1Id, user2Id, requestId)];
            case 6:
                conversation = _c.sent();
                return [3 /*break*/, 13];
            case 7:
                createError_1 = _c.sent();
                if (!(createError_1 instanceof library_1.PrismaClientKnownRequestError && createError_1.code === "P2002")) return [3 /*break*/, 11];
                return [4 /*yield*/, findConversation(user1Id, user2Id)];
            case 8:
                conversation = _c.sent();
                if (!(conversation && requestId)) return [3 /*break*/, 10];
                return [4 /*yield*/, prisma_js_1.prisma.conversation.update({
                        where: { id: conversation.id },
                        data: { requestId: requestId },
                        include: conversationInclude
                    })];
            case 9:
                conversation = _c.sent();
                _c.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11: throw createError_1;
            case 12: return [3 /*break*/, 13];
            case 13: return [3 /*break*/, 16];
            case 14:
                if (!(requestId && !conversation.requestId)) return [3 /*break*/, 16];
                return [4 /*yield*/, prisma_js_1.prisma.conversation.update({
                        where: { id: conversation.id },
                        data: { requestId: requestId },
                        include: conversationInclude
                    })];
            case 15:
                conversation = _c.sent();
                _c.label = 16;
            case 16:
                if (!conversation) {
                    return [2 /*return*/, res.status(404).json({ error: "Conversation not found" })];
                }
                otherUserInfo = conversation.user1Id === userId ? conversation.user2 : conversation.user1;
                res.json({
                    id: conversation.id,
                    otherUser: otherUserInfo,
                    request: conversation.request,
                    createdAt: conversation.createdAt
                });
                return [3 /*break*/, 18];
            case 17:
                error_2 = _c.sent();
                console.error("Error creating conversation:", error_2);
                message = error_2 instanceof Error ? error_2.message : "Failed to create conversation";
                res.status(500).json({ error: message });
                return [3 /*break*/, 18];
            case 18: return [2 /*return*/];
        }
    });
}); });
/**
 * GET /api/chat/conversations/:id/messages
 * Retrieves all messages for a conversation
 *
 * @param req - Express request object with conversation ID in params (requires authentication)
 * @param res - Express response object
 * @returns JSON array of messages or 403/404/500 error
 */
router.get("/conversations/:id/messages", auth_js_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var conversationId, userId, conversation, messages, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                conversationId = Number(req.params.id);
                userId = req.userId;
                if (isNaN(conversationId)) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid conversation ID" })];
                }
                return [4 /*yield*/, prisma_js_1.prisma.conversation.findUnique({
                        where: { id: conversationId },
                        include: {
                            user1: { select: { id: true, name: true } },
                            user2: { select: { id: true, name: true } }
                        }
                    })];
            case 1:
                conversation = _a.sent();
                if (!conversation) {
                    return [2 /*return*/, res.status(404).json({ error: "Conversation not found" })];
                }
                if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
                    return [2 /*return*/, res.status(403).json({ error: "Forbidden" })];
                }
                return [4 /*yield*/, prisma_js_1.prisma.message.findMany({
                        where: { conversationId: conversationId },
                        include: {
                            sender: { select: { id: true, name: true } },
                            receiver: { select: { id: true, name: true } }
                        },
                        orderBy: { createdAt: "asc" }
                    })];
            case 2:
                messages = _a.sent();
                return [4 /*yield*/, prisma_js_1.prisma.message.updateMany({
                        where: {
                            conversationId: conversationId,
                            receiverId: userId,
                            read: false
                        },
                        data: { read: true }
                    })];
            case 3:
                _a.sent();
                res.json(messages);
                return [3 /*break*/, 5];
            case 4:
                error_3 = _a.sent();
                console.error("Error fetching messages:", error_3);
                res.status(500).json({ error: "Failed to fetch messages" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
/**
 * POST /api/chat/messages
 * Sends a message in a conversation
 *
 * @param req - Express request object with message data in body (requires authentication)
 * @param res - Express response object
 * @returns JSON object with created message or 400/403/404/500 error
 */
router.post("/messages", auth_js_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, parse, errors, errorMessage, _a, conversationId, content, conversation, receiverId, message, error_4;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                userId = req.userId;
                parse = sendMessageSchema.safeParse(req.body);
                if (!parse.success) {
                    errors = parse.error.flatten();
                    errorMessage = ((_b = errors.formErrors) === null || _b === void 0 ? void 0 : _b[0]) ||
                        Object.values(errors.fieldErrors || {}).flat()[0] ||
                        "Invalid request data";
                    return [2 /*return*/, res.status(400).json({ error: errorMessage })];
                }
                _a = parse.data, conversationId = _a.conversationId, content = _a.content;
                return [4 /*yield*/, prisma_js_1.prisma.conversation.findUnique({
                        where: { id: conversationId },
                        include: {
                            user1: { select: { id: true } },
                            user2: { select: { id: true } }
                        }
                    })];
            case 1:
                conversation = _c.sent();
                if (!conversation) {
                    return [2 /*return*/, res.status(404).json({ error: "Conversation not found" })];
                }
                if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
                    return [2 /*return*/, res.status(403).json({ error: "Forbidden" })];
                }
                receiverId = conversation.user1Id === userId ? conversation.user2Id : conversation.user1Id;
                return [4 /*yield*/, prisma_js_1.prisma.message.create({
                        data: {
                            conversationId: conversationId,
                            senderId: userId,
                            receiverId: receiverId,
                            content: content.trim()
                        },
                        include: {
                            sender: { select: { id: true, name: true } },
                            receiver: { select: { id: true, name: true } }
                        }
                    })];
            case 2:
                message = _c.sent();
                return [4 /*yield*/, prisma_js_1.prisma.conversation.update({
                        where: { id: conversationId },
                        data: { updatedAt: new Date() }
                    })];
            case 3:
                _c.sent();
                res.status(201).json(message);
                return [3 /*break*/, 5];
            case 4:
                error_4 = _c.sent();
                console.error("Error sending message:", error_4);
                res.status(500).json({ error: "Failed to send message" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
