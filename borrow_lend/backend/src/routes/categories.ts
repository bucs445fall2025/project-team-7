import { Router, Response } from "express";
import { prisma } from "../config/prisma.js";
import { requireAuth, AuthedRequest } from "../middlewares/auth.js";
import { z } from "zod";

const router = Router();

/**
 * Zod schema for category creation validation
 */
const createCategorySchema = z.object({
  name: z.string().min(1),
  icon: z.string().optional(),
  description: z.string().optional().default("")
});

/**
 * Zod schema for category update validation
 */
const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  icon: z.string().optional(),
  description: z.string().optional()
});

/**
 * Zod schema for infoBox creation validation
 */
const createInfoBoxSchema = z.object({
  label: z.string().min(1),
  description: z.string().optional().default("")
});

/**
 * Zod schema for infoBox update validation
 */
const updateInfoBoxSchema = z.object({
  label: z.string().min(1).optional(),
  description: z.string().optional()
});

/**
 * GET /api/categories
 * Retrieves all categories with infoBoxes and request counts
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @returns JSON array of categories
 */
router.get("/", async (req, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: { 
        infoBoxes: { orderBy: { createdAt: "asc" } },
        _count: { select: { borrowRequests: true } }
      },
      orderBy: { name: "asc" }
    });
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

/**
 * GET /api/categories/:id
 * Retrieves a specific category by ID with infoBoxes and request count
 * 
 * @param req - Express request object with category ID in params
 * @param res - Express response object
 * @returns JSON object of the category or 404 if not found
 */
router.get("/:id", async (req, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: { 
        infoBoxes: { orderBy: { createdAt: "asc" } },
        _count: { select: { borrowRequests: true } }
      }
    });

    if (!category) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Failed to fetch category" });
  }
});

/**
 * GET /api/categories/:id/requests
 * Retrieves all pending borrow requests for a category
 * 
 * @param req - Express request object with category ID in params
 * @param res - Express response object
 * @returns JSON array of pending borrow requests
 */
router.get("/:id/requests", async (req, res: Response) => {
  try {
    const categoryId = Number(req.params.id);
    if (isNaN(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const category = await prisma.category.findUnique({ 
      where: { id: categoryId } 
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    
    const requests = await prisma.borrowRequest.findMany({
      where: { 
        categoryId,
        status: "PENDING"
      },
      include: {
        borrower: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true, icon: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(requests);
  } catch (error) {
    console.error("Error fetching category requests:", error);
    res.status(500).json({ error: "Failed to fetch category requests" });
  }
});

/**
 * POST /api/categories
 * Creates a new category (requires authentication)
 * 
 * @param req - Express request object with category data in body
 * @param res - Express response object
 * @returns JSON object of the created category or 400/409/500 error
 */
router.post("/", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const parse = createCategorySchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: parse.error.flatten() });
    }
    
    const existing = await prisma.category.findUnique({ 
      where: { name: parse.data.name } 
    });

    if (existing) {
      return res.status(409).json({ error: "Category already exists" });
    }
    
    const category = await prisma.category.create({
      data: { 
        name: parse.data.name,
        icon: parse.data.icon || null,
        description: parse.data.description || ""
      },
      include: { infoBoxes: true }
    });

    res.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
});

/**
 * PATCH /api/categories/:id
 * Updates an existing category (requires authentication)
 * 
 * @param req - Express request object with category ID in params and update data in body
 * @param res - Express response object
 * @returns JSON object of the updated category or 400/404/500 error
 */
router.patch("/:id", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Not found" });
    }
    
    const parse = updateCategorySchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: parse.error.flatten() });
    }
    
    const updateData: Record<string, unknown> = {};
    if (parse.data.name) updateData.name = parse.data.name;
    if (parse.data.icon !== undefined) updateData.icon = parse.data.icon;
    if (parse.data.description !== undefined) {
      updateData.description = parse.data.description;
    }
    
    const updated = await prisma.category.update({
      where: { id },
      data: updateData,
      include: { infoBoxes: true }
    });

    res.json(updated);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Failed to update category" });
  }
});

/**
 * DELETE /api/categories/:id
 * Deletes a category (requires authentication)
 * Cannot delete if category has existing requests
 * 
 * @param req - Express request object with category ID in params
 * @param res - Express response object
 * @returns 204 No Content or 400/404/500 error
 */
router.delete("/:id", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Not found" });
    }
    
    const requestCount = await prisma.borrowRequest.count({ 
      where: { categoryId: id } 
    });

    if (requestCount > 0) {
      return res.status(400).json({ 
        error: "Cannot delete category with existing requests" 
      });
    }
    
    await prisma.infoBox.deleteMany({ where: { categoryId: id } });
    await prisma.category.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

/**
 * POST /api/categories/:id/infoboxes
 * Creates a new infoBox for a category (requires authentication)
 * 
 * @param req - Express request object with category ID in params and infoBox data in body
 * @param res - Express response object
 * @returns JSON object of the created infoBox or 400/404/500 error
 */
router.post("/:id/infoboxes", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const categoryId = Number(req.params.id);
    if (isNaN(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const category = await prisma.category.findUnique({ 
      where: { id: categoryId } 
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const parse = createInfoBoxSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: parse.error.flatten() });
    }

    const infoBox = await prisma.infoBox.create({
      data: {
        label: parse.data.label,
        description: parse.data.description || "",
        categoryId
      }
    });

    res.status(201).json(infoBox);
  } catch (error) {
    console.error("Error creating infoBox:", error);
    res.status(500).json({ error: "Failed to create infoBox" });
  }
});

/**
 * PATCH /api/categories/:id/infoboxes/:infoboxId
 * Updates an existing infoBox (requires authentication)
 * 
 * @param req - Express request object with category ID and infoBox ID in params, update data in body
 * @param res - Express response object
 * @returns JSON object of the updated infoBox or 400/404/500 error
 */
router.patch("/:id/infoboxes/:infoboxId", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const categoryId = Number(req.params.id);
    const infoboxId = Number(req.params.infoboxId);

    if (isNaN(categoryId) || isNaN(infoboxId)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const category = await prisma.category.findUnique({ 
      where: { id: categoryId } 
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const infoBox = await prisma.infoBox.findUnique({ 
      where: { id: infoboxId } 
    });

    if (!infoBox) {
      return res.status(404).json({ error: "InfoBox not found" });
    }

    if (infoBox.categoryId !== categoryId) {
      return res.status(400).json({ 
        error: "InfoBox does not belong to this category" 
      });
    }

    const parse = updateInfoBoxSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: parse.error.flatten() });
    }

    const updated = await prisma.infoBox.update({
      where: { id: infoboxId },
      data: parse.data
    });

    res.json(updated);
  } catch (error) {
    console.error("Error updating infoBox:", error);
    res.status(500).json({ error: "Failed to update infoBox" });
  }
});

/**
 * DELETE /api/categories/:id/infoboxes/:infoboxId
 * Deletes an infoBox (requires authentication)
 * 
 * @param req - Express request object with category ID and infoBox ID in params
 * @param res - Express response object
 * @returns 204 No Content or 400/404/500 error
 */
router.delete("/:id/infoboxes/:infoboxId", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const categoryId = Number(req.params.id);
    const infoboxId = Number(req.params.infoboxId);

    if (isNaN(categoryId) || isNaN(infoboxId)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const category = await prisma.category.findUnique({ 
      where: { id: categoryId } 
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const infoBox = await prisma.infoBox.findUnique({ 
      where: { id: infoboxId } 
    });

    if (!infoBox) {
      return res.status(404).json({ error: "InfoBox not found" });
    }

    if (infoBox.categoryId !== categoryId) {
      return res.status(400).json({ 
        error: "InfoBox does not belong to this category" 
      });
    }

    await prisma.infoBox.delete({ where: { id: infoboxId } });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting infoBox:", error);
    res.status(500).json({ error: "Failed to delete infoBox" });
  }
});

export default router;
