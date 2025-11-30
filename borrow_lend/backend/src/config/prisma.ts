import { PrismaClient } from "@prisma/client";

/**
 * Prisma database client instance
 * Singleton pattern - use this instance throughout the application
 */
export const prisma = new PrismaClient();