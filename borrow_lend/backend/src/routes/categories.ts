import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { requireAuth, AuthedRequest } from "../middlewares/auth.js";
import { z } from "zod";
import { formatValidationError } from "../utils/errorFormatter.js";

const router = Router();

/**
 * Schema for creating a category
 */
const createCategorySchema = z.object({
  name: z.string().min(1),
  icon: z.string().optional(),
  description: z.string().optional().default("")
});

/**
 * Schema for updating a category
 */
const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  icon: z.string().optional(),
  description: z.string().optional()
});

/**
 * Schema for creating an infoBox
 */
const createInfoBoxSchema = z.object({
  label: z.string().min(1),
  description: z.string().optional().default("")
});

/**
 * Schema for updating an infoBox
 */
const updateInfoBoxSchema = z.object({
  label: z.string().min(1).optional(),
  description: z.string().optional()
});

/**
 * GET /api/categories
 * Get all categories with info boxes and request counts
 * 
 * @returns Array of all categories
 */
router.get("/", async (req, res) => {
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
<<<<<<< HEAD
 * Get a single category by ID with info boxes
 * 
 * @param id - Category ID from URL parameters
 * @returns Category details
 */
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const category = await prisma.category.findUnique({
      where: { id },
      include: { 
        infoBoxes: { orderBy: { createdAt: "asc" } },
        _count: { select: { borrowRequests: true } }
      }
    });
    
    if (!category) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch category" });
  }
});

/**
 * GET /api/categories/:id/requests
 * Get all pending borrow requests for a category
 * 
 * @param id - Category ID from URL parameters
 * @returns Array of pending borrow requests
 */
router.get("/:id/requests", async (req, res) => {
  try {
    const categoryId = Number(req.params.id);
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
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
    res.status(500).json({ error: "Failed to fetch category requests" });
  }
});

/**
 * POST /api/categories
 * Create a new category (requires authentication)
 * 
 * @param req.body - Category data (name, icon, description)
 * @returns Created category
 */
router.post("/", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const parse = createCategorySchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ error: formatValidationError(parse.error) });
      return;
    }
    
    const existing = await prisma.category.findUnique({ where: { name: parse.data.name } });
    if (existing) {
      res.status(409).json({ error: "Category already exists" });
      return;
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
    res.status(500).json({ error: "Failed to create category" });
  }
});

/**
 * PATCH /api/categories/:id
 * Update a category (requires authentication)
 * 
 * @param id - Category ID from URL parameters
 * @param req.body - Partial category data to update
 * @returns Updated category
 */
router.patch("/:id", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.category.findUnique({ where: { id } });
    
    if (!existing) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    
    const parse = updateCategorySchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ error: formatValidationError(parse.error) });
      return;
    }
    
    const updateData: any = {};
    if (parse.data.name) updateData.name = parse.data.name;
    if (parse.data.icon !== undefined) updateData.icon = parse.data.icon;
    if (parse.data.description !== undefined) updateData.description = parse.data.description;
    
    const updated = await prisma.category.update({
      where: { id },
      data: updateData,
      include: { infoBoxes: true }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update category" });
  }
});

/**
 * DELETE /api/categories/:id
 * Delete a category (requires authentication)
 * 
 * @param id - Category ID from URL parameters
 * @returns 204 No Content on success
 */
router.delete("/:id", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.category.findUnique({ where: { id } });
    
    if (!existing) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    
    const requestCount = await prisma.borrowRequest.count({ where: { categoryId: id } });
    if (requestCount > 0) {
      res.status(400).json({ error: "Cannot delete category with existing requests" });
      return;
    }
    
    await prisma.infoBox.deleteMany({ where: { categoryId: id } });
    await prisma.category.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category" });
  }
});

/**
 * POST /api/categories/:id/infoboxes
 * Add an infoBox to a category (requires authentication)
 * 
 * @param id - Category ID from URL parameters
 * @param req.body - InfoBox data (label, description)
 * @returns Created infoBox
 */
router.post("/:id/infoboxes", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const categoryId = Number(req.params.id);
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    
    const parse = createInfoBoxSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ error: formatValidationError(parse.error) });
      return;
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
    res.status(500).json({ error: "Failed to create infoBox" });
  }
});

/**
 * PATCH /api/categories/:id/infoboxes/:infoboxId
 * Update an infoBox (requires authentication)
 * 
 * @param id - Category ID from URL parameters
 * @param infoboxId - InfoBox ID from URL parameters
 * @param req.body - Partial infoBox data to update
 * @returns Updated infoBox
 */
router.patch("/:id/infoboxes/:infoboxId", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const categoryId = Number(req.params.id);
    const infoboxId = Number(req.params.infoboxId);
    
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    
    const infoBox = await prisma.infoBox.findUnique({ where: { id: infoboxId } });
    if (!infoBox) {
      res.status(404).json({ error: "InfoBox not found" });
      return;
    }
    
    if (infoBox.categoryId !== categoryId) {
      res.status(400).json({ error: "InfoBox does not belong to this category" });
      return;
    }
    
    const parse = updateInfoBoxSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ error: formatValidationError(parse.error) });
      return;
    }
    
    const updated = await prisma.infoBox.update({
      where: { id: infoboxId },
      data: parse.data
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update infoBox" });
  }
});

/**
 * DELETE /api/categories/:id/infoboxes/:infoboxId
 * Delete an infoBox (requires authentication)
 * 
 * @param id - Category ID from URL parameters
 * @param infoboxId - InfoBox ID from URL parameters
 * @returns 204 No Content on success
 */
router.delete("/:id/infoboxes/:infoboxId", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const categoryId = Number(req.params.id);
    const infoboxId = Number(req.params.infoboxId);
    
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    
    const infoBox = await prisma.infoBox.findUnique({ where: { id: infoboxId } });
    if (!infoBox) {
      res.status(404).json({ error: "InfoBox not found" });
      return;
    }
    
    if (infoBox.categoryId !== categoryId) {
      res.status(400).json({ error: "InfoBox does not belong to this category" });
      return;
    }
    
    await prisma.infoBox.delete({ where: { id: infoboxId } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete infoBox" });
  }
});

export default router;
