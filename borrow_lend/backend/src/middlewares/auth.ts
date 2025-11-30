import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt.js";

/**
 * Extended Express Request interface with authenticated user ID
 */
<<<<<<< HEAD
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
=======
export interface AuthedRequest extends Request { userId?: number }

/**
 * Express middleware to require authentication via JWT token
 * Validates Bearer token in Authorization header and attaches userId to request
 * 
 * @param req - Express request object (extended with userId)
 * @param res - Express response object
 * @param next - Express next middleware function
 * @returns 401 error if token is missing or invalid, otherwise calls next()
 */
export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
const header = req.headers["authorization"];
if (!header?.startsWith("Bearer ")) return res.status(401).json({ error: "Missing token" });
try {
const token = header.split(" ")[1];
const { userId } = verifyJwt(token);
req.userId = userId;
next();
} catch (e) {
return res.status(401).json({ error: "Invalid token" });
}
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
}