import { PrismaClient } from "@prisma/client";

/**
 * Prisma client instance for database operations
 * Singleton pattern ensures single connection pool across the application
 */
export const prisma = new PrismaClient();