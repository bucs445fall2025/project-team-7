import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

/**
<<<<<<< HEAD
 * JWT payload structure
=======
 * JWT payload structure containing user identification
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
 */
export type JwtPayload = { userId: number };

/**
<<<<<<< HEAD
 * Signs a JWT token with user ID
 * 
 * @param payload - JWT payload containing userId
=======
 * Signs a JWT token with user payload
 * 
 * @param payload - The JWT payload containing userId
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
 * @param expiresIn - Token expiration time (default: "7d")
 * @returns Signed JWT token string
 */
export const signJwt = (payload: JwtPayload, expiresIn: string | number = "7d"): string => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn } as SignOptions);
};

/**
 * Verifies and decodes a JWT token
 * 
<<<<<<< HEAD
 * @param token - JWT token string to verify
 * @returns Decoded JWT payload
=======
 * @param token - The JWT token string to verify
 * @returns Decoded JWT payload containing userId
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
 * @throws Error if token is invalid or expired
 */
export const verifyJwt = (token: string): JwtPayload =>
  jwt.verify(token, env.JWT_SECRET) as JwtPayload;