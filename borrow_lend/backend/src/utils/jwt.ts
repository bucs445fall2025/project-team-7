import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

/**
 * JWT payload structure
 */
export type JwtPayload = { userId: number };

/**
 * Signs a JWT token with user ID
 * 
 * @param payload - JWT payload containing userId
 * @param expiresIn - Token expiration time (default: "7d")
 * @returns Signed JWT token string
 */
export const signJwt = (payload: JwtPayload, expiresIn: string | number = "7d"): string => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn } as SignOptions);
};

/**
 * Verifies and decodes a JWT token
 * 
 * @param token - JWT token string to verify
 * @returns Decoded JWT payload
 * @throws Error if token is invalid or expired
 */
export const verifyJwt = (token: string): JwtPayload =>
  jwt.verify(token, env.JWT_SECRET) as JwtPayload;