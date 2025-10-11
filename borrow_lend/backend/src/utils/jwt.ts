import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

export type JwtPayload = { userId: number };

export const signJwt = (payload: JwtPayload, expiresIn: string | number = "7d"): string => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn } as SignOptions);
};

export const verifyJwt = (token: string): JwtPayload =>
  jwt.verify(token, env.JWT_SECRET) as JwtPayload;