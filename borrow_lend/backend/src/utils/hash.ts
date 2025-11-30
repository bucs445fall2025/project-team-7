import bcrypt from "bcryptjs";

/**
 * Hashes a password using bcrypt
 * 
 * @param pw - Plain text password to hash
 * @returns Promise resolving to hashed password
 */
export const hash = (pw: string) => bcrypt.hash(pw, 10);

/**
 * Compares a plain text password with a hashed password
 * 
 * @param pw - Plain text password
 * @param hashed - Hashed password to compare against
 * @returns Promise resolving to true if passwords match, false otherwise
 */
export const compare = (pw: string, hashed: string) => bcrypt.compare(pw, hashed);