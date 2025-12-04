import { Router, Response } from "express";
import { prisma } from "../config/prisma.js";
import { hash, compare } from "../utils/hash.js";
import { signJwt } from "../utils/jwt.js";
import { z } from "zod";
import { requireAuth, AuthedRequest } from "../middlewares/auth.js";
import { formatValidationError } from "../utils/errorFormatter.js";

const router = Router();

/**
 * Schema for user registration
 */
const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6)
});

/**
 * Schema for user login
 */
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

/**
 * Schema for updating user profile
 */
const updateProfileSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
  password: z.string().min(6).optional(),
  currentPassword: z.string().optional()
});

/**
 * POST /api/auth/register
 * Register a new user
 * 
 * @param req.body - User registration data (email, name, password)
 * @returns Created user and JWT token
 */
router.post("/register", async (req: AuthedRequest, res: Response) => {
  try {
    const parse = registerSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ error: formatValidationError(parse.error) });
      return;
    }
    
    const { email, name, password } = parse.data;
    
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }
    
    const user = await prisma.user.create({
      data: { email, name, password: await hash(password) },
      select: { id: true, email: true, name: true }
    });
    
    const token = signJwt({ userId: user.id });
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
});

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 * 
 * @param req.body - Login credentials (email, password)
 * @returns User information and JWT token
 */
router.post("/login", async (req, res) => {
  try {
    const parse = loginSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ error: formatValidationError(parse.error) });
      return;
    }
    
    const { email, password } = parse.data;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    
    const ok = await compare(password, user.password);
    if (!ok) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    
    const token = signJwt({ userId: user.id });
    res.json({ user: { id: user.id, email: user.email, name: user.name }, token });
  } catch (error) {
    res.status(500).json({ error: "Failed to login" });
  }
});

/**
 * GET /api/auth/me
 * Get current authenticated user's profile (requires authentication)
 * 
 * @returns Current user's profile information
 */
router.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, name: true, createdAt: true }
    });
    
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

/**
 * PATCH /api/auth/me
 * Update current authenticated user's profile (requires authentication)
 * 
 * @param req.body - Partial user data to update (email, name, password)
 * @returns Updated user profile
 */
router.patch("/me", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const parse = updateProfileSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ error: formatValidationError(parse.error) });
      return;
    }
    
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const updateData: any = {};

    if (parse.data.email) {
      const emailExists = await prisma.user.findUnique({ where: { email: parse.data.email } });
      if (emailExists && emailExists.id !== req.userId) {
        res.status(409).json({ error: "Email already registered" });
        return;
      }
      updateData.email = parse.data.email;
    }

    if (parse.data.name) {
      updateData.name = parse.data.name;
    }

    if (parse.data.password) {
      if (!parse.data.currentPassword) {
        res.status(400).json({ error: "Current password is required to change password" });
        return;
      }
      const ok = await compare(parse.data.currentPassword, user.password);
      if (!ok) {
        res.status(401).json({ error: "Current password is incorrect" });
        return;
      }
      updateData.password = await hash(parse.data.password);
    }

    const updated = await prisma.user.update({
      where: { id: req.userId },
      data: updateData,
      select: { id: true, email: true, name: true, createdAt: true }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

/**
 * GET /api/auth/users
 * Get all users (for testing/debugging purposes)
 * 
 * @returns Array of all users
 */
router.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, createdAt: true }
    });
    res.json({ 
      message: `Found ${users.length} users in database`,
      users,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

export default router;
