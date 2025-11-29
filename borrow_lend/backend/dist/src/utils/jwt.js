import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
/**
 * Signs a JWT token with user payload
 *
 * @param payload - The JWT payload containing userId
 * @param expiresIn - Token expiration time (default: "7d")
 * @returns Signed JWT token string
 */
export const signJwt = (payload, expiresIn = "7d") => {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
};
/**
 * Verifies and decodes a JWT token
 *
 * @param token - The JWT token string to verify
 * @returns Decoded JWT payload containing userId
 * @throws Error if token is invalid or expired
 */
export const verifyJwt = (token) => jwt.verify(token, env.JWT_SECRET);
