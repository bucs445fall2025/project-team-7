"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
 * Zod schema for item creation and update validation
 */
var upsertSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().optional().default(""),
    imageUrl: zod_1.z.string().url().optional().nullable(),
    location: zod_1.z.string().min(1),
    isAvailable: zod_1.z.boolean().optional()
});
/**
 * GET /api/items
 * Retrieves all available items
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns JSON array of available items with owner information
 */
router.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var items, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma_js_1.prisma.item.findMany({
                        where: { isAvailable: true },
                        orderBy: { createdAt: "desc" },
                        include: { owner: { select: { id: true, name: true } } }
                    })];
            case 1:
                items = _a.sent();
                res.json(items);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error("Error fetching items:", error_1);
                res.status(500).json({ error: "Failed to fetch items" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * GET /api/items/:id
 * Retrieves a specific item by ID
 *
 * @param req - Express request object with item ID in params
 * @param res - Express response object
 * @returns JSON object of the item or 404 if not found
 */
router.get("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, item, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = Number(req.params.id);
                if (isNaN(id)) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid item ID" })];
                }
                return [4 /*yield*/, prisma_js_1.prisma.item.findUnique({
                        where: { id: id },
                        include: { owner: true }
                    })];
            case 1:
                item = _a.sent();
                if (!item) {
                    return [2 /*return*/, res.status(404).json({ error: "Not found" })];
                }
                res.json(item);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error("Error fetching item:", error_2);
                res.status(500).json({ error: "Failed to fetch item" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * POST /api/items
 * Creates a new item (requires authentication)
 *
 * @param req - Express request object with item data in body
 * @param res - Express response object
 * @returns JSON object of the created item or 400/500 error
 */
router.post("/", auth_js_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var parse, item, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                parse = upsertSchema.safeParse(req.body);
                if (!parse.success) {
                    return [2 /*return*/, res.status(400).json({ error: parse.error.flatten() })];
                }
                return [4 /*yield*/, prisma_js_1.prisma.item.create({
                        data: __assign(__assign({}, parse.data), { ownerId: req.userId })
                    })];
            case 1:
                item = _a.sent();
                res.status(201).json(item);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error("Error creating item:", error_3);
                res.status(500).json({ error: "Failed to create item" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * PATCH /api/items/:id
 * Updates an existing item (requires authentication and ownership)
 *
 * @param req - Express request object with item ID in params and update data in body
 * @param res - Express response object
 * @returns JSON object of the updated item or 403/404/500 error
 */
router.patch("/:id", auth_js_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, existing, parse, updated, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = Number(req.params.id);
                if (isNaN(id)) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid item ID" })];
                }
                return [4 /*yield*/, prisma_js_1.prisma.item.findUnique({ where: { id: id } })];
            case 1:
                existing = _a.sent();
                if (!existing) {
                    return [2 /*return*/, res.status(404).json({ error: "Not found" })];
                }
                if (existing.ownerId !== req.userId) {
                    return [2 /*return*/, res.status(403).json({ error: "Forbidden" })];
                }
                parse = upsertSchema.partial().safeParse(req.body);
                if (!parse.success) {
                    return [2 /*return*/, res.status(400).json({ error: parse.error.flatten() })];
                }
                return [4 /*yield*/, prisma_js_1.prisma.item.update({
                        where: { id: id },
                        data: parse.data
                    })];
            case 2:
                updated = _a.sent();
                res.json(updated);
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                console.error("Error updating item:", error_4);
                res.status(500).json({ error: "Failed to update item" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * DELETE /api/items/:id
 * Deletes an item (requires authentication and ownership)
 *
 * @param req - Express request object with item ID in params
 * @param res - Express response object
 * @returns 204 No Content or 403/404/500 error
 */
router.delete("/:id", auth_js_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, existing, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = Number(req.params.id);
                if (isNaN(id)) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid item ID" })];
                }
                return [4 /*yield*/, prisma_js_1.prisma.item.findUnique({ where: { id: id } })];
            case 1:
                existing = _a.sent();
                if (!existing) {
                    return [2 /*return*/, res.status(404).json({ error: "Not found" })];
                }
                if (existing.ownerId !== req.userId) {
                    return [2 /*return*/, res.status(403).json({ error: "Forbidden" })];
                }
                return [4 /*yield*/, prisma_js_1.prisma.item.delete({ where: { id: id } })];
            case 2:
                _a.sent();
                res.status(204).send();
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                console.error("Error deleting item:", error_5);
                res.status(500).json({ error: "Failed to delete item" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
