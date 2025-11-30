import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { requireAuth, AuthedRequest } from "../middlewares/auth.js";
import { z } from "zod";
import { parseDate, validateDateRange } from "../utils/dateParser.js";
import { formatValidationError } from "../utils/errorFormatter.js";

const router = Router();

/**
 * Schema for creating a borrow request
 */
const requestSchema = z.object({
  categoryId: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().optional().default(""),
  message: z.string().optional().default(""),
  startDate: z.union([z.string(), z.null()]).optional(),
  endDate: z.union([z.string(), z.null()]).optional(),
  itemId: z.number().int().positive().optional()
});

/**
 * Schema for updating a borrow request
 */
const updateRequestSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  message: z.string().optional(),
  startDate: z.union([z.string(), z.null()]).optional(),
  endDate: z.union([z.string(), z.null()]).optional()
});

/**
 * Schema for updating request status
 */
const statusSchema = z.object({ 
  action: z.enum(["approve", "decline", "cancel"]) 
});

/**
 * Validates item availability and ownership
 * 
 * @param itemId - Item ID to validate
 * @param userId - Current user ID
 * @returns Error message if invalid, null if valid
 */
async function validateItem(itemId: number, userId: number): Promise<string | null> {
  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (!item) return "Item not found";
  if (!item.isAvailable) return "Item is not available";
  if (item.ownerId === userId) return "Cannot borrow your own item";
  return null;
}

/**
 * POST /api/requests
 * Create a new borrow request (requires authentication)
 * 
 * @param req.body - Request data (categoryId, title, description, message, dates, itemId)
 * @returns Created borrow request
 */
router.post("/", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const parse = requestSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ error: formatValidationError(parse.error) });
      return;
    }
    
    const { categoryId, title, description, message, startDate, endDate, itemId } = parse.data;
    
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    
    if (itemId) {
      const itemError = await validateItem(itemId, req.userId!);
      if (itemError) {
        res.status(400).json({ error: itemError });
        return;
      }
    }

    const parsedStartDate = parseDate(startDate);
    const parsedEndDate = parseDate(endDate);
    const dateError = validateDateRange(parsedStartDate, parsedEndDate);
    if (dateError) {
      res.status(400).json({ error: dateError });
      return;
    }

    const reqRow = await prisma.borrowRequest.create({
      data: {
        categoryId,
        title,
        description: description || "",
        borrowerId: req.userId!,
        message: message || "",
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        itemId: itemId || null
      },
      include: {
        category: { select: { id: true, name: true, icon: true } },
        borrower: { select: { id: true, name: true, email: true } }
      }
    });

    res.status(201).json(reqRow);
  } catch (error) {
    res.status(500).json({ error: "Failed to create request" });
  }
});

/**
 * GET /api/requests/mine
 * Get all borrow requests created by the current user (requires authentication)
 * 
 * @returns Array of user's borrow requests
 */
router.get("/mine", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const rows = await prisma.borrowRequest.findMany({
      where: { borrowerId: req.userId! },
      orderBy: { createdAt: "desc" },
      include: { 
        item: true,
        category: { select: { id: true, name: true, icon: true } }
      }
    });
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

/**
 * GET /api/requests/received
 * Get all borrow requests received for user's items (requires authentication)
 * 
 * @returns Array of received borrow requests
 */
router.get("/received", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const rows = await prisma.borrowRequest.findMany({
      where: { item: { ownerId: req.userId! } },
      orderBy: { createdAt: "desc" },
      include: { 
        item: true, 
        borrower: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true, icon: true } }
      }
    });
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch received requests" });
  }
});

/**
 * PUT /api/requests/:id
 * Update a borrow request (requires authentication, borrower only, pending only)
 * 
 * @param id - Request ID from URL parameters
 * @param req.body - Partial request data to update
 * @returns Updated borrow request
 */
router.put("/:id", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const id = Number(req.params.id);
    const parse = updateRequestSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ error: formatValidationError(parse.error) });
      return;
    }

    const br = await prisma.borrowRequest.findUnique({ where: { id } });
    if (!br) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    
    if (br.borrowerId !== req.userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    
    if (br.status !== "PENDING") {
      res.status(400).json({ error: "Can only edit pending requests" });
      return;
    }

    const parsedStartDate = parse.data.startDate !== undefined 
      ? parseDate(parse.data.startDate) 
      : null;
    const parsedEndDate = parse.data.endDate !== undefined 
      ? parseDate(parse.data.endDate) 
      : null;
    
    const dateError = validateDateRange(
      parsedStartDate || (br.startDate ? new Date(br.startDate) : null),
      parsedEndDate || (br.endDate ? new Date(br.endDate) : null)
    );
    if (dateError) {
      res.status(400).json({ error: dateError });
      return;
    }

    const updateData: any = {};
    if (parse.data.title !== undefined) updateData.title = parse.data.title;
    if (parse.data.description !== undefined) updateData.description = parse.data.description;
    if (parse.data.message !== undefined) updateData.message = parse.data.message;
    if (parse.data.startDate !== undefined) updateData.startDate = parsedStartDate;
    if (parse.data.endDate !== undefined) updateData.endDate = parsedEndDate;

    const updated = await prisma.borrowRequest.update({
      where: { id },
      data: updateData,
      include: {
        category: { select: { id: true, name: true, icon: true } },
        borrower: { select: { id: true, name: true, email: true } }
      }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update request" });
  }
});

/**
 * DELETE /api/requests/:id
 * Delete a borrow request (requires authentication, borrower only)
 * 
 * @param id - Request ID from URL parameters
 * @returns 204 No Content on success
 */
router.delete("/:id", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const id = Number(req.params.id);
    const br = await prisma.borrowRequest.findUnique({ where: { id } });
    
    if (!br) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    
    if (br.borrowerId !== req.userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    
    await prisma.borrowRequest.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete request" });
  }
});

/**
 * PATCH /api/requests/:id
 * Update request status (approve/decline/cancel) (requires authentication)
 * 
 * @param id - Request ID from URL parameters
 * @param req.body - Status action (approve, decline, or cancel)
 * @returns Updated borrow request
 */
router.patch("/:id", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const id = Number(req.params.id);
    const parse = statusSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ error: formatValidationError(parse.error) });
      return;
    }

    const br = await prisma.borrowRequest.findUnique({ 
      where: { id }, 
      include: { item: true, borrower: { select: { id: true, name: true, email: true } } }
    });
    
    if (!br) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    const { action } = parse.data;
    if (action === "cancel") {
      if (br.borrowerId !== req.userId) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      const updated = await prisma.borrowRequest.update({ 
        where: { id }, 
        data: { status: "CANCELED" },
        include: {
          category: { select: { id: true, name: true, icon: true } },
          borrower: { select: { id: true, name: true, email: true } }
        }
      });
      res.json(updated);
    } else {
      const status = action === "approve" ? "APPROVED" : "DECLINED";
      const updated = await prisma.borrowRequest.update({ 
        where: { id }, 
        data: { status },
        include: {
          category: { select: { id: true, name: true, icon: true } },
          borrower: { select: { id: true, name: true, email: true } }
        }
      });

      if (status === "APPROVED" && br.itemId) {
        await prisma.item.update({ 
          where: { id: br.itemId }, 
          data: { isAvailable: false } 
        });
      }

      res.json(updated);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update request status" });
  }
});

export default router;
