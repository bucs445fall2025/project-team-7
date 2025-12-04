import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { requireAuth } from "../middlewares/auth.js";
import { z } from "zod";
const router = Router();
/**
 * Zod schema for item creation and update validation
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
 * Retrieves all available items
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns JSON array of available items with owner information
 */
router.get("/", async (req, res) => {
    try {
        const items = await prisma.item.findMany({
            where: { isAvailable: true },
            orderBy: { createdAt: "desc" },
            include: { owner: { select: { id: true, name: true } } }
        });
        res.json(items);
    }
    catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ error: "Failed to fetch items" });
    }
});
/**
 * GET /api/items/:id
 * Retrieves a specific item by ID
 *
 * @param req - Express request object with item ID in params
 * @param res - Express response object
 * @returns JSON object of the item or 404 if not found
 */
router.get("/:id", async (req, res) => {
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
    }
    catch (error) {
        console.error("Error fetching item:", error);
        res.status(500).json({ error: "Failed to fetch item" });
    }
});
/**
 * POST /api/items
 * Creates a new item (requires authentication)
 *
 * @param req - Express request object with item data in body
 * @param res - Express response object
 * @returns JSON object of the created item or 400/500 error
 */
router.post("/", requireAuth, async (req, res) => {
    try {
        const parse = upsertSchema.safeParse(req.body);
        if (!parse.success) {
            return res.status(400).json({ error: parse.error.flatten() });
        }
        const item = await prisma.item.create({
            data: { ...parse.data, ownerId: req.userId }
        });
        res.status(201).json(item);
    }
    catch (error) {
        console.error("Error creating item:", error);
        res.status(500).json({ error: "Failed to create item" });
    }
});
/**
 * PATCH /api/items/:id
 * Updates an existing item (requires authentication and ownership)
 *
 * @param req - Express request object with item ID in params and update data in body
 * @param res - Express response object
 * @returns JSON object of the updated item or 403/404/500 error
 */
router.patch("/:id", requireAuth, async (req, res) => {
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
    }
    catch (error) {
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
router.delete("/:id", requireAuth, async (req, res) => {
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
    }
    catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ error: "Failed to delete item" });
    }
});
export default router;
