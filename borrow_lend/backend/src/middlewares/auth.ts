import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt.js";

/**
 * Extended Express Request interface with authenticated user ID
 */
export interface AuthedRequest extends Request { 
  userId?: number;
}

/**
 * Middleware to require authentication for protected routes
 * Validates JWT token from Authorization header
 * 
 * @param req - Express request object (AuthedRequest)
 * @param res - Express response object
 * @param next - Express next function
 */
export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  const header = req.headers["authorization"];
  
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing token" });
    return;
  }
  
  try {
    const token = header.split(" ")[1];
    const { userId } = verifyJwt(token);
    req.userId = userId;
    next();
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
}