import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { requireAuth, AuthedRequest } from "../middlewares/auth.js";
import { z } from "zod";
import { formatValidationError } from "../utils/errorFormatter.js";

const router = Router();

/**
 * Schema for creating/updating items
 */
const upsertSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().default(""),
  imageUrl: z.string().url().optional().nullable(),
  location: z.string().min(1),
  isAvailable: z.boolean().optional()
});

/**
 * GET /api/items
 * Get all available items
 * 
 * @returns Array of available items with owner information
 */
router.get("/", async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      where: { isAvailable: true },
      orderBy: { createdAt: "desc" },
      include: { owner: { select: { id: true, name: true } } }
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

/**
 * GET /api/items/:id
 * Get a single item by ID
 * 
 * @param id - Item ID from URL parameters
 * @returns Item details with owner information
 */
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const item = await prisma.item.findUnique({ 
      where: { id }, 
      include: { owner: true } 
    });
    
    if (!item) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch item" });
  }
});

/**
 * POST /api/items
 * Create a new item (requires authentication)
 * 
 * @param req.body - Item data (title, description, imageUrl, location, isAvailable)
 * @returns Created item
 */
router.post("/", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const parse = upsertSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ error: formatValidationError(parse.error) });
      return;
    }
    
    const item = await prisma.item.create({
      data: { ...parse.data, ownerId: req.userId! }
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: "Failed to create item" });
  }
});

/**
 * PATCH /api/items/:id
 * Update an existing item (requires authentication, owner only)
 * 
 * @param id - Item ID from URL parameters
 * @param req.body - Partial item data to update
 * @returns Updated item
 */
router.patch("/:id", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.item.findUnique({ where: { id } });
    
    if (!existing) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    
    if (existing.ownerId !== req.userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    
    const parse = upsertSchema.partial().safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ error: formatValidationError(parse.error) });
      return;
    }
    
    const updated = await prisma.item.update({ 
      where: { id }, 
      data: parse.data 
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update item" });
  }
});

/**
 * DELETE /api/items/:id
 * Delete an item (requires authentication, owner only)
 * 
 * @param id - Item ID from URL parameters
 * @returns 204 No Content on success
 */
router.delete("/:id", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.item.findUnique({ where: { id } });
    
    if (!existing) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    
    if (existing.ownerId !== req.userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    
    await prisma.item.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete item" });
  }
});

export default router;
