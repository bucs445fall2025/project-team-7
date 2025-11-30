import { Request, Response, NextFunction } from "express";

/**
 * Global error handler middleware
 * Catches all errors and returns appropriate HTTP responses
 * 
 * @param err - The error object
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log error in development
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", err);
  }

  // Handle Prisma errors
  if (err.name === "PrismaClientKnownRequestError") {
    res.status(400).json({ error: "Database error occurred" });
    return;
  }

  // Handle validation errors
  if (err.name === "ZodError") {
    res.status(400).json({ error: "Invalid request data" });
    return;
  }

  // Default error response
  res.status(500).json({ 
    error: process.env.NODE_ENV === "production" 
      ? "Internal server error" 
      : err.message 
  });
}



