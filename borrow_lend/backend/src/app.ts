import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.js";
import itemRoutes from "./routes/items.js";
import requestRoutes from "./routes/requests.js";
import categoryRoutes from "./routes/categories.js";
<<<<<<< HEAD
import chatRoutes from "./routes/chat.js";
import { errorHandler } from "./middlewares/errorHandler.js";

=======

/**
 * Express application instance
 * Configures middleware and routes for the Borrow & Lend API
 */
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));

// JSON body parser
app.use(express.json());

/**
 * Root endpoint - API information
<<<<<<< HEAD
 */
app.get("/", (_req, res) => res.json({ 
=======
 * 
 * @param _req - Express request object (unused)
 * @param res - Express response object
 * @returns JSON with API information and available endpoints
 */
app.get("/", (_req: Request, res: Response) => res.json({ 
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
  message: "Borrow & Lend API", 
  version: "1.0.0",
  endpoints: {
    health: "/health",
    auth: "/api/auth",
    items: "/api/items", 
    requests: "/api/requests",
    categories: "/api/categories"
  }
}));

/**
 * Health check endpoint
<<<<<<< HEAD
 */
app.get("/health", (_req, res) => res.json({ ok: true }));

=======
 * 
 * @param _req - Express request object (unused)
 * @param res - Express response object
 * @returns JSON with health status
 */
app.get("/health", (_req: Request, res: Response) => res.json({ ok: true }));

// API routes
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/categories", categoryRoutes);
<<<<<<< HEAD
app.use("/api/chat", chatRoutes);

// Global error handler (must be last)
app.use(errorHandler);
=======

/**
 * Global error handler middleware
 * Catches all unhandled errors and returns appropriate response
 * 
 * @param err - Error object
 * @param _req - Express request object (unused)
 * @param res - Express response object
 * @param _next - Express next middleware function (unused)
 */
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c

export default app;