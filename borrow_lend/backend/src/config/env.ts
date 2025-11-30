import "dotenv/config";

/**
<<<<<<< HEAD
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
=======
 * Retrieves a required environment variable or throws an error
 * 
 * @param key - The environment variable key to retrieve
 * @param fallback - Optional fallback value if env var is not set
 * @returns The environment variable value
 * @throws Error if the environment variable is missing and no fallback is provided
 */
const required = (key: string, fallback?: string) => {
const v = process.env[key] ?? fallback;
if (v === undefined) throw new Error(`Missing env ${key}`);
return v;
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
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