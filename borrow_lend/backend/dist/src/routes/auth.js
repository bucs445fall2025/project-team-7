import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { hash, compare } from "../utils/hash.js";
import { signJwt } from "../utils/jwt.js";
import { z } from "zod";
import { requireAuth } from "../middlewares/auth.js";
const router = Router();
/**
 * Zod schema for user registration validation
 * Requires email to end with @binghamton.edu
 */
const registerSchema = z.object({
    email: z.string().email().refine((email) => email.endsWith("@binghamton.edu"), { message: "Email must be a @binghamton.edu address" }),
    name: z.string().min(1),
    password: z.string().min(6)
});
/**
 * Zod schema for user login validation
 */
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});
/**
 * Zod schema for user profile update validation
 * Requires email to end with @binghamton.edu if provided
 */
const updateProfileSchema = z.object({
    email: z.string().email().refine((email) => email.endsWith("@binghamton.edu"), { message: "Email must be a @binghamton.edu address" }).optional(),
    name: z.string().min(1).optional(),
    password: z.string().min(6).optional(),
    currentPassword: z.string().optional()
});
/**
 * Validates and prepares email update data
 *
 * @param email - New email address
 * @param userId - Current user ID
 * @returns Update data object or null if email already exists
 * @throws Error if email is already taken by another user
 */
async function validateEmailUpdate(email, userId) {
    const emailExists = await prisma.user.findUnique({
        where: { email }
    });
    if (emailExists && emailExists.id !== userId) {
        throw new Error("Email already registered");
    }
    return { email };
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
async function validatePasswordUpdate(newPassword, currentPassword, hashedPassword) {
    if (!currentPassword) {
        throw new Error("Current password is required to change password");
    }
    const ok = await compare(currentPassword, hashedPassword);
    if (!ok) {
        throw new Error("Current password is incorrect");
    }
    return await hash(newPassword);
}
/**
 * POST /api/auth/register
 * Registers a new user account
 *
 * @param req - Express request object with registration data in body
 * @param res - Express response object
 * @returns JSON object with user data and JWT token or 400/409/500 error
 */
router.post("/register", async (req, res) => {
    try {
        const parse = registerSchema.safeParse(req.body);
        if (!parse.success) {
            // Extract the error message for better clarity
            const emailError = parse.error.issues.find(issue => issue.path[0] === "email");
            if (emailError) {
                return res.status(400).json({
                    error: emailError.message || "Email must be a @binghamton.edu address"
                });
            }
            return res.status(400).json({ error: parse.error.flatten() });
        }
        const { email, name, password } = parse.data;
        const exists = await prisma.user.findUnique({ where: { email } });
        if (exists) {
            return res.status(409).json({ error: "Email already registered" });
        }
        const user = await prisma.user.create({
            data: { email, name, password: await hash(password) },
            select: { id: true, email: true, name: true }
        });
        const token = signJwt({ userId: user.id });
        return res.status(201).json({ user, token });
    }
    catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ error: "Failed to register user" });
    }
});
/**
 * POST /api/auth/login
 * Authenticates a user and returns a JWT token
 *
 * @param req - Express request object with login credentials in body
 * @param res - Express response object
 * @returns JSON object with user data and JWT token or 400/401/500 error
 */
router.post("/login", async (req, res) => {
    try {
        const parse = loginSchema.safeParse(req.body);
        if (!parse.success) {
            return res.status(400).json({ error: parse.error.flatten() });
        }
        const { email, password } = parse.data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const ok = await compare(password, user.password);
        if (!ok) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = signJwt({ userId: user.id });
        return res.json({
            user: { id: user.id, email: user.email, name: user.name },
            token
        });
    }
    catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ error: "Failed to login" });
    }
});
/**
 * GET /api/auth/me
 * Retrieves the current authenticated user's profile
 *
 * @param req - Express request object (requires authentication)
 * @param res - Express response object
 * @returns JSON object with user profile data or 404/500 error
 */
router.get("/me", requireAuth, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { id: true, email: true, name: true, createdAt: true }
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.json(user);
    }
    catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ error: "Failed to fetch user" });
    }
});
/**
 * PATCH /api/auth/me
 * Updates the current authenticated user's profile
 *
 * @param req - Express request object with update data in body (requires authentication)
 * @param res - Express response object
 * @returns JSON object with updated user data or 400/401/404/409/500 error
 */
router.patch("/me", requireAuth, async (req, res) => {
    try {
        const parse = updateProfileSchema.safeParse(req.body);
        if (!parse.success) {
            return res.status(400).json({ error: parse.error.flatten() });
        }
        const user = await prisma.user.findUnique({ where: { id: req.userId } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const updateData = {};
        if (parse.data.email) {
            try {
                Object.assign(updateData, await validateEmailUpdate(parse.data.email, req.userId));
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "Email validation failed";
                return res.status(409).json({ error: message });
            }
        }
        if (parse.data.name) {
            updateData.name = parse.data.name;
        }
        if (parse.data.password) {
            try {
                updateData.password = await validatePasswordUpdate(parse.data.password, parse.data.currentPassword || "", user.password);
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "Password validation failed";
                const status = message.includes("incorrect") ? 401 : 400;
                return res.status(status).json({ error: message });
            }
        }
        const updated = await prisma.user.update({
            where: { id: req.userId },
            data: updateData,
            select: { id: true, email: true, name: true, createdAt: true }
        });
        return res.json(updated);
    }
    catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ error: "Failed to update user" });
    }
});
/**
 * GET /api/auth/users
 * Retrieves all users in the database (for testing/debugging)
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns JSON object with array of users or 500 error
 */
router.get("/users", async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, email: true, name: true, createdAt: true }
        });
        return res.json({
            message: `Found ${users.length} users in database`,
            users,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ error: "Failed to fetch users" });
    }
});
export default router;
