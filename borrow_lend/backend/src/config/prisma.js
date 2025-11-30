"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
var client_1 = require("@prisma/client");
/**
 * Prisma client instance for database operations
 * Singleton pattern ensures single connection pool across the application
 */
exports.prisma = new client_1.PrismaClient();
