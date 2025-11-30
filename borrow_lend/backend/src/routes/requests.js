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
var router = (0, express_1.Router)();
/**
 * Zod schema for borrow request creation validation
 */
var requestSchema = zod_1.z.object({
    itemId: zod_1.z.number().int().positive(),
    message: zod_1.z.string().optional().default(""),
    startDate: zod_1.z.string().datetime().optional().nullable(),
    endDate: zod_1.z.string().datetime().optional().nullable()
});
/**
 * Zod schema for request status update validation
 */
var statusSchema = zod_1.z.object({
    action: zod_1.z.enum(["approve", "decline", "cancel"])
});
/**
 * POST /api/requests
 * Creates a new borrow request (requires authentication)
 *
 * @param req - Express request object with request data in body
 * @param res - Express response object
 * @returns JSON object of the created request or 400/404/500 error
 */
router.post("/", auth_js_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var parse, _a, itemId, message, startDate, endDate, item, defaultCategory, reqRow, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                parse = requestSchema.safeParse(req.body);
                if (!parse.success) {
                    return [2 /*return*/, res.status(400).json({ error: parse.error.flatten() })];
                }
                _a = parse.data, itemId = _a.itemId, message = _a.message, startDate = _a.startDate, endDate = _a.endDate;
                return [4 /*yield*/, prisma_js_1.prisma.item.findUnique({ where: { id: itemId } })];
            case 1:
                item = _b.sent();
                if (!item) {
                    return [2 /*return*/, res.status(404).json({ error: "Item not found" })];
                }
                if (!item.isAvailable) {
                    return [2 /*return*/, res.status(400).json({ error: "Item is not available" })];
                }
                if (item.ownerId === req.userId) {
                    return [2 /*return*/, res.status(400).json({ error: "Cannot borrow your own item" })];
                }
                return [4 /*yield*/, prisma_js_1.prisma.category.findFirst()];
            case 2:
                defaultCategory = _b.sent();
                if (!defaultCategory) {
                    return [2 /*return*/, res.status(400).json({ error: "No categories available" })];
                }
                return [4 /*yield*/, prisma_js_1.prisma.borrowRequest.create({
                        data: {
                            itemId: itemId || undefined,
                            categoryId: defaultCategory.id,
                            borrowerId: req.userId,
                            title: item.title,
                            message: message || "",
                            startDate: startDate ? new Date(startDate) : null,
                            endDate: endDate ? new Date(endDate) : null
                        }
                    })];
            case 3:
                reqRow = _b.sent();
                res.status(201).json(reqRow);
                return [3 /*break*/, 5];
            case 4:
                error_1 = _b.sent();
                console.error("Error creating borrow request:", error_1);
                res.status(500).json({ error: "Failed to create borrow request" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
/**
 * GET /api/requests/mine
 * Retrieves all borrow requests created by the current user (requires authentication)
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns JSON array of borrow requests with item information
 */
router.get("/mine", auth_js_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var rows, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma_js_1.prisma.borrowRequest.findMany({
                        where: { borrowerId: req.userId },
                        orderBy: { createdAt: "desc" },
                        include: { item: true }
                    })];
            case 1:
                rows = _a.sent();
                res.json(rows);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error("Error fetching user requests:", error_2);
                res.status(500).json({ error: "Failed to fetch requests" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * GET /api/requests/received
 * Retrieves all borrow requests received for the current user's items (requires authentication)
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns JSON array of borrow requests with item and borrower information
 */
router.get("/received", auth_js_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var rows, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma_js_1.prisma.borrowRequest.findMany({
                        where: { item: { ownerId: req.userId } },
                        orderBy: { createdAt: "desc" },
                        include: {
                            item: true,
                            borrower: { select: { id: true, name: true } }
                        }
                    })];
            case 1:
                rows = _a.sent();
                res.json(rows);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error("Error fetching received requests:", error_3);
                res.status(500).json({ error: "Failed to fetch received requests" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * PATCH /api/requests/:id
 * Updates the status of a borrow request (requires authentication)
 * Owner can approve/decline, borrower can cancel
 *
 * @param req - Express request object with request ID in params and action in body
 * @param res - Express response object
 * @returns JSON object of the updated request or 400/403/404/500 error
 */
router.patch("/:id", auth_js_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, parse, br, action, updated, status_1, updated, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                id = Number(req.params.id);
                if (isNaN(id)) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid request ID" })];
                }
                parse = statusSchema.safeParse(req.body);
                if (!parse.success) {
                    return [2 /*return*/, res.status(400).json({ error: parse.error.flatten() })];
                }
                return [4 /*yield*/, prisma_js_1.prisma.borrowRequest.findUnique({
                        where: { id: id },
                        include: { item: true }
                    })];
            case 1:
                br = _a.sent();
                if (!br) {
                    return [2 /*return*/, res.status(404).json({ error: "Not found" })];
                }
                action = parse.data.action;
                if (!(action === "cancel")) return [3 /*break*/, 3];
                if (br.borrowerId !== req.userId) {
                    return [2 /*return*/, res.status(403).json({ error: "Forbidden" })];
                }
                return [4 /*yield*/, prisma_js_1.prisma.borrowRequest.update({
                        where: { id: id },
                        data: { status: "CANCELED" }
                    })];
            case 2:
                updated = _a.sent();
                return [2 /*return*/, res.json(updated)];
            case 3:
                if (!br.item || br.item.ownerId !== req.userId) {
                    return [2 /*return*/, res.status(403).json({ error: "Forbidden" })];
                }
                status_1 = action === "approve" ? "APPROVED" : "DECLINED";
                return [4 /*yield*/, prisma_js_1.prisma.borrowRequest.update({
                        where: { id: id },
                        data: { status: status_1 }
                    })];
            case 4:
                updated = _a.sent();
                if (!(status_1 === "APPROVED" && br.itemId)) return [3 /*break*/, 6];
                return [4 /*yield*/, prisma_js_1.prisma.item.update({
                        where: { id: br.itemId },
                        data: { isAvailable: false }
                    })];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [2 /*return*/, res.json(updated)];
            case 7: return [3 /*break*/, 9];
            case 8:
                error_4 = _a.sent();
                console.error("Error updating request status:", error_4);
                res.status(500).json({ error: "Failed to update request status" });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
