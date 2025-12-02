import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.js";
import itemRoutes from "./routes/items.js";
import requestRoutes from "./routes/requests.js";
import categoryRoutes from "./routes/categories.js";
import chatRoutes from "./routes/chat.js";
import { errorHandler } from "./middlewares/errorHandler.js";

/**
 * Express application instance
 * Configures middleware and routes for the Borrow & Lend API
 */
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));

// JSON body parser
app.use(express.json());

/**
 * Root endpoint - API information
 * 
 * @param _req - Express request object (unused)
 * @param res - Express response object
 * @returns JSON with API information and available endpoints
 */
app.get("/", (_req: Request, res: Response) => res.json({ 
  message: "Borrow & Lend API", 
  version: "1.0.0",
  endpoints: {
    health: "/health",
    auth: "/api/auth",
    items: "/api/items", 
    requests: "/api/requests",
    categories: "/api/categories",
    chat: "/api/chat"
  }
}));

/**
 * Health check endpoint
 * 
 * @param _req - Express request object (unused)
 * @param res - Express response object
 * @returns JSON with health status
 */
app.get("/health", (_req: Request, res: Response) => res.json({ ok: true }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/chat", chatRoutes);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
