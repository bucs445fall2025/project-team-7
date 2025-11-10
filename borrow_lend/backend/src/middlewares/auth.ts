import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt.js";


export interface AuthedRequest extends Request { 
    userId?: number;
}


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