import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { requireAuth } from "../middlewares/auth.js";
import { z } from "zod";
const router = Router();
router.get("/", async (req, res) => {
    const items = await prisma.item.findMany({
        where: { isAvailable: true },
        orderBy: { createdAt: "desc" },
        include: { owner: { select: { id: true, name: true } } }
    });
    res.json(items);
});
router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const item = await prisma.item.findUnique({ where: { id }, include: { owner: true } });
    if (!item)
        return res.status(404).json({ error: "Not found" });
    res.json(item);
});
const upsertSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional().default(""),
    imageUrl: z.string().url().optional().nullable(),
    location: z.string().min(1),
    isAvailable: z.boolean().optional()
});
router.post("/", requireAuth, async (req, res) => {
    const parse = upsertSchema.safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: parse.error.flatten() });
    const item = await prisma.item.create({
        data: { ...parse.data, ownerId: req.userId }
    });
    res.status(201).json(item);
});
router.patch("/:id", requireAuth, async (req, res) => {
    const id = Number(req.params.id);
    const existing = await prisma.item.findUnique({ where: { id } });
    if (!existing)
        return res.status(404).json({ error: "Not found" });
    if (existing.ownerId !== req.userId)
        return res.status(403).json({ error: "Forbidden" });
    const parse = upsertSchema.partial().safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: parse.error.flatten() });
    const updated = await prisma.item.update({ where: { id }, data: parse.data });
    res.json(updated);
});
router.delete("/:id", requireAuth, async (req, res) => {
    const id = Number(req.params.id);
    const existing = await prisma.item.findUnique({ where: { id } });
    if (!existing)
        return res.status(404).json({ error: "Not found" });
    if (existing.ownerId !== req.userId)
        return res.status(403).json({ error: "Forbidden" });
    await prisma.item.delete({ where: { id } });
    res.status(204).send();
});
export default router;
