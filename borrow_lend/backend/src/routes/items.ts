import { Router, Response } from "express";
import { prisma } from "../config/prisma.js";
import { requireAuth, AuthedRequest } from "../middlewares/auth.js";
import { z } from "zod";
<<<<<<< HEAD
import { formatValidationError } from "../utils/errorFormatter.js";
=======
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c

const router = Router();

/**
<<<<<<< HEAD
 * Schema for creating/updating items
=======
 * Zod schema for item creation and update validation
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
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
<<<<<<< HEAD
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
=======
 * Retrieves all available items
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @returns JSON array of available items with owner information
 */
router.get("/", async (req, res: Response) => {
try {
const items = await prisma.item.findMany({
where: { isAvailable: true },
orderBy: { createdAt: "desc" },
include: { owner: { select: { id: true, name: true } } }
});
res.json(items);
} catch (error) {
console.error("Error fetching items:", error);
res.status(500).json({ error: "Failed to fetch items" });
}
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
});

/**
 * GET /api/items/:id
<<<<<<< HEAD
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
=======
 * Retrieves a specific item by ID
 * 
 * @param req - Express request object with item ID in params
 * @param res - Express response object
 * @returns JSON object of the item or 404 if not found
 */
router.get("/:id", async (req, res: Response) => {
try {
const id = Number(req.params.id);
if (isNaN(id)) {
return res.status(400).json({ error: "Invalid item ID" });
}

const item = await prisma.item.findUnique({ 
where: { id }, 
include: { owner: true } 
});

if (!item) {
return res.status(404).json({ error: "Not found" });
}

res.json(item);
} catch (error) {
console.error("Error fetching item:", error);
res.status(500).json({ error: "Failed to fetch item" });
}
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
});

/**
 * POST /api/items
<<<<<<< HEAD
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
=======
 * Creates a new item (requires authentication)
 * 
 * @param req - Express request object with item data in body
 * @param res - Express response object
 * @returns JSON object of the created item or 400/500 error
 */
router.post("/", requireAuth, async (req: AuthedRequest, res: Response) => {
try {
const parse = upsertSchema.safeParse(req.body);
if (!parse.success) {
return res.status(400).json({ error: parse.error.flatten() });
}

const item = await prisma.item.create({
data: { ...parse.data, ownerId: req.userId! }
});

res.status(201).json(item);
} catch (error) {
console.error("Error creating item:", error);
res.status(500).json({ error: "Failed to create item" });
}
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
});

/**
 * PATCH /api/items/:id
<<<<<<< HEAD
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
=======
 * Updates an existing item (requires authentication and ownership)
 * 
 * @param req - Express request object with item ID in params and update data in body
 * @param res - Express response object
 * @returns JSON object of the updated item or 403/404/500 error
 */
router.patch("/:id", requireAuth, async (req: AuthedRequest, res: Response) => {
try {
const id = Number(req.params.id);
if (isNaN(id)) {
return res.status(400).json({ error: "Invalid item ID" });
}

const existing = await prisma.item.findUnique({ where: { id } });
if (!existing) {
return res.status(404).json({ error: "Not found" });
}

if (existing.ownerId !== req.userId) {
return res.status(403).json({ error: "Forbidden" });
}

const parse = upsertSchema.partial().safeParse(req.body);
if (!parse.success) {
return res.status(400).json({ error: parse.error.flatten() });
}

const updated = await prisma.item.update({ 
where: { id }, 
data: parse.data 
});

res.json(updated);
} catch (error) {
console.error("Error updating item:", error);
res.status(500).json({ error: "Failed to update item" });
}
});

/**
 * DELETE /api/items/:id
 * Deletes an item (requires authentication and ownership)
 * 
 * @param req - Express request object with item ID in params
 * @param res - Express response object
 * @returns 204 No Content or 403/404/500 error
 */
router.delete("/:id", requireAuth, async (req: AuthedRequest, res: Response) => {
try {
const id = Number(req.params.id);
if (isNaN(id)) {
return res.status(400).json({ error: "Invalid item ID" });
}

const existing = await prisma.item.findUnique({ where: { id } });
if (!existing) {
return res.status(404).json({ error: "Not found" });
}

if (existing.ownerId !== req.userId) {
return res.status(403).json({ error: "Forbidden" });
}

await prisma.item.delete({ where: { id } });
res.status(204).send();
} catch (error) {
console.error("Error deleting item:", error);
res.status(500).json({ error: "Failed to delete item" });
}
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
});

export default router;
