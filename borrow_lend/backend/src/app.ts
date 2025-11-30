import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.js";
import itemRoutes from "./routes/items.js";
import requestRoutes from "./routes/requests.js";
import categoryRoutes from "./routes/categories.js";
import chatRoutes from "./routes/chat.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

/**
 * Root endpoint - API information
 */
app.get("/", (_req, res) => res.json({ 
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
 */
app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/chat", chatRoutes);

// Global error handler (must be last)
app.use(errorHandler);

export default app;