import bcrypt from "bcryptjs";

/**
<<<<<<< HEAD
 * Hashes a password using bcrypt
 * 
 * @param pw - Plain text password to hash
 * @returns Promise resolving to hashed password
=======
 * Hashes a plain text password using bcrypt
 * 
 * @param pw - The plain text password to hash
 * @returns Promise resolving to the hashed password string
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
 */
export const hash = (pw: string) => bcrypt.hash(pw, 10);

/**
 * Compares a plain text password with a hashed password
 * 
<<<<<<< HEAD
 * @param pw - Plain text password
 * @param hashed - Hashed password to compare against
=======
 * @param pw - The plain text password to compare
 * @param hashed - The hashed password to compare against
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
 * @returns Promise resolving to true if passwords match, false otherwise
 */
export const compare = (pw: string, hashed: string) => bcrypt.compare(pw, hashed);