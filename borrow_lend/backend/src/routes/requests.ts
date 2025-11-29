import { Router, Response } from "express";
import { prisma } from "../config/prisma.js";
import { requireAuth, AuthedRequest } from "../middlewares/auth.js";
import { z } from "zod";

const router = Router();

/**
 * Zod schema for borrow request creation validation
 */
const requestSchema = z.object({
  itemId: z.number().int().positive(),
  message: z.string().optional().default(""),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable()
});

/**
 * Zod schema for request status update validation
 */
const statusSchema = z.object({ 
  action: z.enum(["approve", "decline", "cancel"]) 
});

/**
 * POST /api/requests
 * Creates a new borrow request (requires authentication)
 * 
 * @param req - Express request object with request data in body
 * @param res - Express response object
 * @returns JSON object of the created request or 400/404/500 error
 */
router.post("/", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const parse = requestSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: parse.error.flatten() });
    }
    
    const { itemId, message, startDate, endDate } = parse.data;
    
    const item = await prisma.item.findUnique({ where: { id: itemId } });
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (!item.isAvailable) {
      return res.status(400).json({ error: "Item is not available" });
    }

    if (item.ownerId === req.userId) {
      return res.status(400).json({ error: "Cannot borrow your own item" });
    }

    // Get category from item (assuming items have categories)
    // For now, we'll need to get a default category or require it
    // This is a temporary fix - the schema requires categoryId
    const defaultCategory = await prisma.category.findFirst();
    if (!defaultCategory) {
      return res.status(400).json({ error: "No categories available" });
    }

    const reqRow = await prisma.borrowRequest.create({
      data: {
        itemId: itemId || undefined,
        categoryId: defaultCategory.id,
        borrowerId: req.userId!,
        title: item.title,
        message: message || "",
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null
      }
    });

    res.status(201).json(reqRow);
  } catch (error) {
    console.error("Error creating borrow request:", error);
    res.status(500).json({ error: "Failed to create borrow request" });
  }
});

/**
 * GET /api/requests/mine
 * Retrieves all borrow requests created by the current user (requires authentication)
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @returns JSON array of borrow requests with item information
 */
router.get("/mine", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const rows = await prisma.borrowRequest.findMany({
      where: { borrowerId: req.userId! },
      orderBy: { createdAt: "desc" },
      include: { item: true }
    });
    res.json(rows);
  } catch (error) {
    console.error("Error fetching user requests:", error);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

/**
 * GET /api/requests/received
 * Retrieves all borrow requests received for the current user's items (requires authentication)
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @returns JSON array of borrow requests with item and borrower information
 */
router.get("/received", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const rows = await prisma.borrowRequest.findMany({
      where: { item: { ownerId: req.userId! } },
      orderBy: { createdAt: "desc" },
      include: { 
        item: true, 
        borrower: { select: { id: true, name: true } } 
      }
    });
    res.json(rows);
  } catch (error) {
    console.error("Error fetching received requests:", error);
    res.status(500).json({ error: "Failed to fetch received requests" });
  }
});

/**
 * PATCH /api/requests/:id
 * Updates the status of a borrow request (requires authentication)
 * Owner can approve/decline, borrower can cancel
 * 
 * @param req - Express request object with request ID in params and action in body
 * @param res - Express response object
 * @returns JSON object of the updated request or 400/403/404/500 error
 */
router.patch("/:id", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid request ID" });
    }

    const parse = statusSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: parse.error.flatten() });
    }

    const br = await prisma.borrowRequest.findUnique({ 
      where: { id }, 
      include: { item: true } 
    });

    if (!br) {
      return res.status(404).json({ error: "Not found" });
    }

    const { action } = parse.data;

    if (action === "cancel") {
      if (br.borrowerId !== req.userId) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const updated = await prisma.borrowRequest.update({ 
        where: { id }, 
        data: { status: "CANCELED" } 
      });
      return res.json(updated);
    } else {
      if (!br.item || br.item.ownerId !== req.userId) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const status = action === "approve" ? "APPROVED" : "DECLINED";
      const updated = await prisma.borrowRequest.update({ 
        where: { id }, 
        data: { status } 
      });

      if (status === "APPROVED" && br.itemId) {
        await prisma.item.update({ 
          where: { id: br.itemId }, 
          data: { isAvailable: false } 
        });
      }

      return res.json(updated);
    }
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ error: "Failed to update request status" });
  }
});

export default router;
