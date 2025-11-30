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
var hash_js_1 = require("../utils/hash.js");
var jwt_js_1 = require("../utils/jwt.js");
var zod_1 = require("zod");
var auth_js_1 = require("../middlewares/auth.js");
var router = (0, express_1.Router)();
/**
 * Zod schema for user registration validation
 * Requires email to end with @binghamton.edu
 */
var registerSchema = zod_1.z.object({
    email: zod_1.z.string().email().refine(function (email) { return email.endsWith("@binghamton.edu"); }, { message: "Email must be a @binghamton.edu address" }),
    name: zod_1.z.string().min(1),
    password: zod_1.z.string().min(6)
});
/**
 * Zod schema for user login validation
 */
var loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6)
});
/**
 * Zod schema for user profile update validation
 * Requires email to end with @binghamton.edu if provided
 */
var updateProfileSchema = zod_1.z.object({
    email: zod_1.z.string().email().refine(function (email) { return email.endsWith("@binghamton.edu"); }, { message: "Email must be a @binghamton.edu address" }).optional(),
    name: zod_1.z.string().min(1).optional(),
    password: zod_1.z.string().min(6).optional(),
    currentPassword: zod_1.z.string().optional()
});
/**
 * Validates and prepares email update data
 *
 * @param email - New email address
 * @param userId - Current user ID
 * @returns Update data object or null if email already exists
 * @throws Error if email is already taken by another user
 */
function validateEmailUpdate(email, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var emailExists;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma_js_1.prisma.user.findUnique({
                        where: { email: email }
                    })];
                case 1:
                    emailExists = _a.sent();
                    if (emailExists && emailExists.id !== userId) {
                        throw new Error("Email already registered");
                    }
                    return [2 /*return*/, { email: email }];
            }
        });
    });
}
/**
 * Validates and hashes password update
 *
 * @param newPassword - New password
 * @param currentPassword - Current password for verification
 * @param hashedPassword - Hashed current password from database
 * @returns Hashed new password
 * @throws Error if current password is incorrect
 */
function validatePasswordUpdate(newPassword, currentPassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function () {
        var ok;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!currentPassword) {
                        throw new Error("Current password is required to change password");
                    }
                    return [4 /*yield*/, (0, hash_js_1.compare)(currentPassword, hashedPassword)];
                case 1:
                    ok = _a.sent();
                    if (!ok) {
                        throw new Error("Current password is incorrect");
                    }
                    return [4 /*yield*/, (0, hash_js_1.hash)(newPassword)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/**
 * POST /api/auth/register
 * Registers a new user account
 *
 * @param req - Express request object with registration data in body
 * @param res - Express response object
 * @returns JSON object with user data and JWT token or 400/409/500 error
 */
router.post("/register", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var parse, emailError, _a, email, name_1, password, exists, user, _b, _c, token, error_1;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 4, , 5]);
                parse = registerSchema.safeParse(req.body);
                if (!parse.success) {
                    emailError = parse.error.issues.find(function (issue) { return issue.path[0] === "email"; });
                    if (emailError) {
                        return [2 /*return*/, res.status(400).json({
                                error: emailError.message || "Email must be a @binghamton.edu address"
                            })];
                    }
                    return [2 /*return*/, res.status(400).json({ error: parse.error.flatten() })];
                }
                _a = parse.data, email = _a.email, name_1 = _a.name, password = _a.password;
                return [4 /*yield*/, prisma_js_1.prisma.user.findUnique({ where: { email: email } })];
            case 1:
                exists = _f.sent();
                if (exists) {
                    return [2 /*return*/, res.status(409).json({ error: "Email already registered" })];
                }
                _c = (_b = prisma_js_1.prisma.user).create;
                _d = {};
                _e = { email: email, name: name_1 };
                return [4 /*yield*/, (0, hash_js_1.hash)(password)];
            case 2: return [4 /*yield*/, _c.apply(_b, [(_d.data = (_e.password = _f.sent(), _e),
                        _d.select = { id: true, email: true, name: true },
                        _d)])];
            case 3:
                user = _f.sent();
                token = (0, jwt_js_1.signJwt)({ userId: user.id });
                return [2 /*return*/, res.status(201).json({ user: user, token: token })];
            case 4:
                error_1 = _f.sent();
                console.error("Error registering user:", error_1);
                return [2 /*return*/, res.status(500).json({ error: "Failed to register user" })];
            case 5: return [2 /*return*/];
        }
    });
}); });
/**
 * POST /api/auth/login
 * Authenticates a user and returns a JWT token
 *
 * @param req - Express request object with login credentials in body
 * @param res - Express response object
 * @returns JSON object with user data and JWT token or 400/401/500 error
 */
router.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var parse, _a, email, password, user, ok, token, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                parse = loginSchema.safeParse(req.body);
                if (!parse.success) {
                    return [2 /*return*/, res.status(400).json({ error: parse.error.flatten() })];
                }
                _a = parse.data, email = _a.email, password = _a.password;
                return [4 /*yield*/, prisma_js_1.prisma.user.findUnique({ where: { email: email } })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(401).json({ error: "Invalid credentials" })];
                }
                return [4 /*yield*/, (0, hash_js_1.compare)(password, user.password)];
            case 2:
                ok = _b.sent();
                if (!ok) {
                    return [2 /*return*/, res.status(401).json({ error: "Invalid credentials" })];
                }
                token = (0, jwt_js_1.signJwt)({ userId: user.id });
                return [2 /*return*/, res.json({
                        user: { id: user.id, email: user.email, name: user.name },
                        token: token
                    })];
            case 3:
                error_2 = _b.sent();
                console.error("Error logging in user:", error_2);
                return [2 /*return*/, res.status(500).json({ error: "Failed to login" })];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * GET /api/auth/me
 * Retrieves the current authenticated user's profile
 *
 * @param req - Express request object (requires authentication)
 * @param res - Express response object
 * @returns JSON object with user profile data or 404/500 error
 */
router.get("/me", auth_js_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma_js_1.prisma.user.findUnique({
                        where: { id: req.userId },
                        select: { id: true, email: true, name: true, createdAt: true }
                    })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ error: "User not found" })];
                }
                return [2 /*return*/, res.json(user)];
            case 2:
                error_3 = _a.sent();
                console.error("Error fetching user:", error_3);
                return [2 /*return*/, res.status(500).json({ error: "Failed to fetch user" })];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * PATCH /api/auth/me
 * Updates the current authenticated user's profile
 *
 * @param req - Express request object with update data in body (requires authentication)
 * @param res - Express response object
 * @returns JSON object with updated user data or 400/401/404/409/500 error
 */
router.patch("/me", auth_js_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var parse, user, updateData, _a, _b, _c, error_4, message, _d, error_5, message, status_1, updated, error_6;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 11, , 12]);
                parse = updateProfileSchema.safeParse(req.body);
                if (!parse.success) {
                    return [2 /*return*/, res.status(400).json({ error: parse.error.flatten() })];
                }
                return [4 /*yield*/, prisma_js_1.prisma.user.findUnique({ where: { id: req.userId } })];
            case 1:
                user = _e.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ error: "User not found" })];
                }
                updateData = {};
                if (!parse.data.email) return [3 /*break*/, 5];
                _e.label = 2;
            case 2:
                _e.trys.push([2, 4, , 5]);
                _b = (_a = Object).assign;
                _c = [updateData];
                return [4 /*yield*/, validateEmailUpdate(parse.data.email, req.userId)];
            case 3:
                _b.apply(_a, _c.concat([_e.sent()]));
                return [3 /*break*/, 5];
            case 4:
                error_4 = _e.sent();
                message = error_4 instanceof Error ? error_4.message : "Email validation failed";
                return [2 /*return*/, res.status(409).json({ error: message })];
            case 5:
                if (parse.data.name) {
                    updateData.name = parse.data.name;
                }
                if (!parse.data.password) return [3 /*break*/, 9];
                _e.label = 6;
            case 6:
                _e.trys.push([6, 8, , 9]);
                _d = updateData;
                return [4 /*yield*/, validatePasswordUpdate(parse.data.password, parse.data.currentPassword || "", user.password)];
            case 7:
                _d.password = _e.sent();
                return [3 /*break*/, 9];
            case 8:
                error_5 = _e.sent();
                message = error_5 instanceof Error ? error_5.message : "Password validation failed";
                status_1 = message.includes("incorrect") ? 401 : 400;
                return [2 /*return*/, res.status(status_1).json({ error: message })];
            case 9: return [4 /*yield*/, prisma_js_1.prisma.user.update({
                    where: { id: req.userId },
                    data: updateData,
                    select: { id: true, email: true, name: true, createdAt: true }
                })];
            case 10:
                updated = _e.sent();
                return [2 /*return*/, res.json(updated)];
            case 11:
                error_6 = _e.sent();
                console.error("Error updating user:", error_6);
                return [2 /*return*/, res.status(500).json({ error: "Failed to update user" })];
            case 12: return [2 /*return*/];
        }
    });
}); });
/**
 * GET /api/auth/users
 * Retrieves all users in the database (for testing/debugging)
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns JSON object with array of users or 500 error
 */
router.get("/users", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma_js_1.prisma.user.findMany({
                        select: { id: true, email: true, name: true, createdAt: true }
                    })];
            case 1:
                users = _a.sent();
                return [2 /*return*/, res.json({
                        message: "Found ".concat(users.length, " users in database"),
                        users: users,
                        timestamp: new Date().toISOString()
                    })];
            case 2:
                error_7 = _a.sent();
                console.error("Error fetching users:", error_7);
                return [2 /*return*/, res.status(500).json({ error: "Failed to fetch users" })];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
