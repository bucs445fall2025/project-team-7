import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { requireAuth, AuthedRequest } from "../middlewares/auth.js";
import { z } from "zod";

const router = Router();

// Create a borrow request
const requestSchema = z.object({
  itemId: z.number().int().positive(),
  message: z.string().optional().default(""),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable()
});

router.post("/", requireAuth, async (req: AuthedRequest, res) => {
  const parse = requestSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  
  const { itemId, message, startDate, endDate } = parse.data;
  
  // Check if item exists and is available
  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (!item) return res.status(404).json({ error: "Item not found" });
  if (!item.isAvailable) return res.status(400).json({ error: "Item is not available" });
  if (item.ownerId === req.userId) return res.status(400).json({ error: "Cannot borrow your own item" });

  const reqRow = await prisma.borrowRequest.create({
    data: {
      itemId,
      borrowerId: req.userId!,
      message: message || "",
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null
    }
  });

  res.status(201).json(reqRow);
});

// Requests created by me (as borrower)
router.get("/mine", requireAuth, async (req: AuthedRequest, res) => {
  const rows = await prisma.borrowRequest.findMany({
    where: { borrowerId: req.userId! },
    orderBy: { createdAt: "desc" },
    include: { item: true }
  });
  res.json(rows);
});

// Requests received for my items (as owner)
router.get("/received", requireAuth, async (req: AuthedRequest, res) => {
  const rows = await prisma.borrowRequest.findMany({
    where: { item: { ownerId: req.userId! } },
    orderBy: { createdAt: "desc" },
    include: { item: true, borrower: { select: { id: true, name: true } } }
  });
  res.json(rows);
});

// Update status (owner can approve/decline; borrower can cancel)
const statusSchema = z.object({ action: z.enum(["approve", "decline", "cancel"]) });

router.patch("/:id", requireAuth, async (req: AuthedRequest, res) => {
  const id = Number(req.params.id);
  const parse = statusSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

  const br = await prisma.borrowRequest.findUnique({ where: { id }, include: { item: true } });
  if (!br) return res.status(404).json({ error: "Not found" });

  const { action } = parse.data;
  if (action === "cancel") {
    if (br.borrowerId !== req.userId) return res.status(403).json({ error: "Forbidden" });
    const updated = await prisma.borrowRequest.update({ where: { id }, data: { status: "CANCELED" } });
    return res.json(updated);
  } else {
    if (br.item.ownerId !== req.userId) return res.status(403).json({ error: "Forbidden" });
    const status = action === "approve" ? "APPROVED" : "DECLINED";
    const updated = await prisma.borrowRequest.update({ where: { id }, data: { status } });

    // When approved, you might want to set the item unavailable
    if (status === "APPROVED") {
      await prisma.item.update({ where: { id: br.itemId }, data: { isAvailable: false } });
    }

    return res.json(updated);
  }
});

export default router;