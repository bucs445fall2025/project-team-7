import "dotenv/config";

/**
 * Gets a required environment variable or throws an error
 * 
 * @param key - Environment variable key
 * @param fallback - Optional fallback value
 * @returns Environment variable value
 * @throws Error if variable is missing and no fallback provided
 */
const required = (key: string, fallback?: string): string => {
  const v = process.env[key] ?? fallback;
  if (v === undefined) {
    throw new Error(`Missing env ${key}`);
  }
  return v;
};

/**
 * Application environment configuration
 */
export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: parseInt(process.env.PORT || "8000", 10),
  DATABASE_URL: required("DATABASE_URL"),
  JWT_SECRET: required("JWT_SECRET"),
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*"
};