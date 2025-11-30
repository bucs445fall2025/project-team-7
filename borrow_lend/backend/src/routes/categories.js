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
 * Zod schema for category creation validation
 */
var createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    icon: zod_1.z.string().optional(),
    description: zod_1.z.string().optional().default("")
});
/**
 * Zod schema for category update validation
 */
var updateCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    icon: zod_1.z.string().optional(),
    description: zod_1.z.string().optional()
});
/**
 * Zod schema for infoBox creation validation
 */
var createInfoBoxSchema = zod_1.z.object({
    label: zod_1.z.string().min(1),
    description: zod_1.z.string().optional().default("")
});
/**
 * Zod schema for infoBox update validation
 */
var updateInfoBoxSchema = zod_1.z.object({
    label: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional()
});
/**
 * GET /api/categories
 * Retrieves all categories with infoBoxes and request counts
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns JSON array of categories
 */
router.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var categories, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma_js_1.prisma.category.findMany({
                        include: {
                            infoBoxes: { orderBy: { createdAt: "asc" } },
                            _count: { select: { borrowRequests: true } }
                        },
                        orderBy: { name: "asc" }
                    })];
            case 1:
                categories = _a.sent();
                res.json(categories);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error("Error fetching categories:", error_1);
                res.status(500).json({ error: "Failed to fetch categories" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * GET /api/categories/:id
 * Retrieves a specific category by ID with infoBoxes and request count
 *
 * @param req - Express request object with category ID in params
 * @param res - Express response object
 * @returns JSON object of the category or 404 if not found
 */
router.get("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, category, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = Number(req.params.id);
                if (isNaN(id)) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid category ID" })];
                }
                return [4 /*yield*/, prisma_js_1.prisma.category.findUnique({
                        where: { id: id },
                        include: {
                            infoBoxes: { orderBy: { createdAt: "asc" } },
                            _count: { select: { borrowRequests: true } }
                        }
                    })];
            case 1:
                category = _a.sent();
                if (!category) {
                    return [2 /*return*/, res.status(404).json({ error: "Not found" })];
                }
                res.json(category);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error("Error fetching category:", error_2);
                res.status(500).json({ error: "Failed to fetch category" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * GET /api/categories/:id/requests
 * Retrieves all pending borrow requests for a category
 *
 * @param req - Express request object with category ID in params
 * @param res - Express response object
 * @returns JSON array of pending borrow requests
 */
router.get("/:id/requests", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var categoryId, category, requests, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                categoryId = Number(req.params.id);
                if (isNaN(categoryId)) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid category ID" })];
                }
                return [4 /*yield*/, prisma_js_1.prisma.category.findUnique({
                        where: { id: categoryId }
                    })];
            case 1:
                category = _a.sent();
                if (!category) {
                    return [2 /*return*/, res.status(404).json({ error: "Category not found" })];
                }
                return [4 /*yield*/, prisma_js_1.prisma.borrowRequest.findMany({
                        where: {
                            categoryId: categoryId,
                            status: "PENDING"
                        },
                        include: {
                            borrower: { select: { id: true, name: true, email: true } },
                            category: { select: { id: true, name: true, icon: true } }
                        },
                        orderBy: { createdAt: "desc" }
                    })];
            case 2:
                requests = _a.sent();
                res.json(requests);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error("Error fetching category requests:", error_3);
                res.status(500).json({ error: "Failed to fetch category requests" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * POST /api/categories
 * Creates a new category (requires authentication)
 *
 * @param req - Express request object with category data in body
 * @param res - Express response object
 * @returns JSON object of the created category or 400/409/500 error
 */
router.post("/", auth_js_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var parse, existing, category, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                parse = createCategorySchema.safeParse(req.body);
                if (!parse.success) {
                    return [2 /*return*/, res.status(400).json({ error: parse.error.flatten() })];
                }
                return [4 /*yield*/, prisma_js_1.prisma.category.findUnique({
                        where: { name: parse.data.name }
                    })];
            case 1:
                existing = _a.sent();
                if (existing) {
                    return [2 /*return*/, res.status(409).json({ error: "Category already exists" })];
                }
                return [4 /*yield*/, prisma_js_1.prisma.category.create({
                        data: {
                            name: parse.data.name,
                            icon: parse.data.icon || null,
                            description: parse.data.description || ""
                        },
                        include: { infoBoxes: true }
                    })];
            case 2:
                category = _a.sent();
                res.status(201).json(category);
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                console.error("Error creating category:", error_4);
                res.status(500).json({ error: "Failed to create category" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * PATCH /api/categories/:id
 * Updates an existing category (requires authentication)
 *
 * @param req - Express request object with category ID in params and update data in body
 * @param res - Express response object
 * @returns JSON object of the updated category or 400/404/500 error
 */
router.patch("/:id", auth_js_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, existing, parse, updateData, updated, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = Number(req.params.id);
                if (isNaN(id)) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid category ID" })];
                }
                return [4 /*yield*/, prisma_js_1.prisma.category.findUnique({ where: { id: id } })];
            case 1:
                existing = _a.sent();
                if (!existing) {
                    return [2 /*return*/, res.status(404).json({ error: "Not found" })];
                }
                parse = updateCategorySchema.safeParse(req.body);
                if (!parse.success) {
                    return [2 /*return*/, res.status(400).json({ error: parse.error.flatten() })];
                }
                updateData = {};
                if (parse.data.name)
                    updateData.name = parse.data.name;
                if (parse.data.icon !== undefined)
                    updateData.icon = parse.data.icon;
                if (parse.data.description !== undefined) {
                    updateData.description = parse.data.description;
                }
                return [4 /*yield*/, prisma_js_1.prisma.category.update({
                        where: { id: id },
                        data: updateData,
                        include: { infoBoxes: true }
                    })];
            case 2:
                updated = _a.sent();
                res.json(updated);
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                console.error("Error updating category:", error_5);
                res.status(500).json({ error: "Failed to update category" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * DELETE /api/categories/:id
 * Deletes a category (requires authentication)
 * Cannot delete if category has existing requests
 *
 * @param req - Express request object with category ID in params
 * @param res - Express response object
 * @returns 204 No Content or 400/404/500 error
 */
router.delete("/:id", auth_js_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, existing, requestCount, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                id = Number(req.params.id);
                if (isNaN(id)) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid category ID" })];
                }
                return [4 /*yield*/, prisma_js_1.prisma.category.findUnique({ where: { id: id } })];
            case 1:
                existing = _a.sent();
                if (!existing) {
                    return [2 /*return*/, res.status(404).json({ error: "Not found" })];
                }
                return [4 /*yield*/, prisma_js_1.prisma.borrowRequest.count({
                        where: { categoryId: id }
                    })];
            case 2:
                requestCount = _a.sent();
                if (requestCount > 0) {
                    return [2 /*return*/, res.status(400).json({
                            error: "Cannot delete category with existing requests"
                        })];
                }
                return [4 /*yield*/, prisma_js_1.prisma.infoBox.deleteMany({ where: { categoryId: id } })];
            case 3:
                _a.sent();
                return [4 /*yield*/, prisma_js_1.prisma.category.delete({ where: { id: id } })];
            case 4:
                _a.sent();
                res.status(204).send();
                return [3 /*break*/, 6];
            case 5:
                error_6 = _a.sent();
                console.error("Error deleting category:", error_6);
                res.status(500).json({ error: "Failed to delete category" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
/**
 * POST /api/categories/:id/infoboxes
 * Creates a new infoBox for a category (requires authentication)
 *
 * @param req - Express request object with category ID in params and infoBox data in body
 * @param res - Express response object
 * @returns JSON object of the created infoBox or 400/404/500 error
 */
router.post("/:id/infoboxes", auth_js_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var categoryId, category, parse, infoBox, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                categoryId = Number(req.params.id);
                if (isNaN(categoryId)) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid category ID" })];
                }
                return [4 /*yield*/, prisma_js_1.prisma.category.findUnique({
                        where: { id: categoryId }
                    })];
            case 1:
                category = _a.sent();
                if (!category) {
                    return [2 /*return*/, res.status(404).json({ error: "Category not found" })];
                }
                parse = createInfoBoxSchema.safeParse(req.body);
                if (!parse.success) {
                    return [2 /*return*/, res.status(400).json({ error: parse.error.flatten() })];
                }
                return [4 /*yield*/, prisma_js_1.prisma.infoBox.create({
                        data: {
                            label: parse.data.label,
                            description: parse.data.description || "",
                            categoryId: categoryId
                        }
                    })];
            case 2:
                infoBox = _a.sent();
                res.status(201).json(infoBox);
                return [3 /*break*/, 4];
            case 3:
                error_7 = _a.sent();
                console.error("Error creating infoBox:", error_7);
                res.status(500).json({ error: "Failed to create infoBox" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * PATCH /api/categories/:id/infoboxes/:infoboxId
 * Updates an existing infoBox (requires authentication)
 *
 * @param req - Express request object with category ID and infoBox ID in params, update data in body
 * @param res - Express response object
 * @returns JSON object of the updated infoBox or 400/404/500 error
 */
router.patch("/:id/infoboxes/:infoboxId", auth_js_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var categoryId, infoboxId, category, infoBox, parse, updated, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                categoryId = Number(req.params.id);
                infoboxId = Number(req.params.infoboxId);
                if (isNaN(categoryId) || isNaN(infoboxId)) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid ID" })];
                }
                return [4 /*yield*/, prisma_js_1.prisma.category.findUnique({
                        where: { id: categoryId }
                    })];
            case 1:
                category = _a.sent();
                if (!category) {
                    return [2 /*return*/, res.status(404).json({ error: "Category not found" })];
                }
                return [4 /*yield*/, prisma_js_1.prisma.infoBox.findUnique({
                        where: { id: infoboxId }
                    })];
            case 2:
                infoBox = _a.sent();
                if (!infoBox) {
                    return [2 /*return*/, res.status(404).json({ error: "InfoBox not found" })];
                }
                if (infoBox.categoryId !== categoryId) {
                    return [2 /*return*/, res.status(400).json({
                            error: "InfoBox does not belong to this category"
                        })];
                }
                parse = updateInfoBoxSchema.safeParse(req.body);
                if (!parse.success) {
                    return [2 /*return*/, res.status(400).json({ error: parse.error.flatten() })];
                }
                return [4 /*yield*/, prisma_js_1.prisma.infoBox.update({
                        where: { id: infoboxId },
                        data: parse.data
                    })];
            case 3:
                updated = _a.sent();
                res.json(updated);
                return [3 /*break*/, 5];
            case 4:
                error_8 = _a.sent();
                console.error("Error updating infoBox:", error_8);
                res.status(500).json({ error: "Failed to update infoBox" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
/**
 * DELETE /api/categories/:id/infoboxes/:infoboxId
 * Deletes an infoBox (requires authentication)
 *
 * @param req - Express request object with category ID and infoBox ID in params
 * @param res - Express response object
 * @returns 204 No Content or 400/404/500 error
 */
router.delete("/:id/infoboxes/:infoboxId", auth_js_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var categoryId, infoboxId, category, infoBox, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                categoryId = Number(req.params.id);
                infoboxId = Number(req.params.infoboxId);
                if (isNaN(categoryId) || isNaN(infoboxId)) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid ID" })];
                }
                return [4 /*yield*/, prisma_js_1.prisma.category.findUnique({
                        where: { id: categoryId }
                    })];
            case 1:
                category = _a.sent();
                if (!category) {
                    return [2 /*return*/, res.status(404).json({ error: "Category not found" })];
                }
                return [4 /*yield*/, prisma_js_1.prisma.infoBox.findUnique({
                        where: { id: infoboxId }
                    })];
            case 2:
                infoBox = _a.sent();
                if (!infoBox) {
                    return [2 /*return*/, res.status(404).json({ error: "InfoBox not found" })];
                }
                if (infoBox.categoryId !== categoryId) {
                    return [2 /*return*/, res.status(400).json({
                            error: "InfoBox does not belong to this category"
                        })];
                }
                return [4 /*yield*/, prisma_js_1.prisma.infoBox.delete({ where: { id: infoboxId } })];
            case 3:
                _a.sent();
                res.status(204).send();
                return [3 /*break*/, 5];
            case 4:
                error_9 = _a.sent();
                console.error("Error deleting infoBox:", error_9);
                res.status(500).json({ error: "Failed to delete infoBox" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
