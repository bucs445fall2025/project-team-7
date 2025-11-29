import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt.js";

/**
 * Extended Express Request interface with authenticated user ID
 */
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
}