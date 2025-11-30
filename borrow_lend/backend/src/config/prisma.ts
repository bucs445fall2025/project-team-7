import { PrismaClient } from "@prisma/client";

/**
<<<<<<< HEAD
 * Prisma database client instance
 * Singleton pattern - use this instance throughout the application
=======
 * Prisma client instance for database operations
 * Singleton pattern ensures single connection pool across the application
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
 */
export const prisma = new PrismaClient();