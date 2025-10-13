import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
export const signJwt = (payload, expiresIn = "7d") => {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
};
export const verifyJwt = (token) => jwt.verify(token, env.JWT_SECRET);
