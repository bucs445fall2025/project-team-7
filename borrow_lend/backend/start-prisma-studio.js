#!/usr/bin/env node
import "dotenv/config";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("Starting Prisma Studio...");
if (process.env.DATABASE_URL) {
  console.log("✓ DATABASE_URL is set");
  // Mask password in log for security
  const maskedUrl = process.env.DATABASE_URL.replace(/:([^:@]+)@/, ":****@");
  console.log("  Connection:", maskedUrl);
} else {
  console.error("✗ DATABASE_URL is missing!");
  console.error("  Make sure your .env file contains DATABASE_URL");
  console.error("  For Docker, it should point to: mysql://bl_user:bl_pass@mysql:3306/borrowlend");
  process.exit(1);
}

// Ensure we're in the right directory
process.chdir(__dirname);

// Start Prisma Studio with environment variables
// Use explicit path to schema
const schemaPath = resolve(__dirname, "./prisma/schema.prisma");
console.log("  Schema path:", schemaPath);

const prismaStudio = spawn("npx", [
  "prisma",
  "studio",
  "--hostname",
  "0.0.0.0",
  "--port",
  "5555",
  "--browser",
  "none",
  "--schema",
  schemaPath
], {
  stdio: "inherit",
  env: {
    ...process.env,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV || "production"
  },
  cwd: __dirname,
  shell: true
});

prismaStudio.on("error", (error) => {
  console.error("Error starting Prisma Studio:", error);
  process.exit(1);
});

prismaStudio.on("exit", (code) => {
  if (code !== 0 && code !== null) {
    console.error(`Prisma Studio exited with code ${code}`);
    process.exit(code);
  }
});

// Keep process alive
process.on("SIGINT", () => {
  prismaStudio.kill();
  process.exit(0);
});

process.on("SIGTERM", () => {
  prismaStudio.kill();
  process.exit(0);
});

