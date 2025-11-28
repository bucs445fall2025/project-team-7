import bcrypt from "bcryptjs";

/**
 * Hashes a plain text password using bcrypt
 * 
 * @param pw - The plain text password to hash
 * @returns Promise resolving to the hashed password string
 */
export const hash = (pw: string) => bcrypt.hash(pw, 10);

/**
 * Compares a plain text password with a hashed password
 * 
 * @param pw - The plain text password to compare
 * @param hashed - The hashed password to compare against
 * @returns Promise resolving to true if passwords match, false otherwise
 */
export const compare = (pw: string, hashed: string) => bcrypt.compare(pw, hashed);