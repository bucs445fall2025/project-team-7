import "dotenv/config";
/**
 * Retrieves a required environment variable or throws an error
 *
 * @param key - The environment variable key to retrieve
 * @param fallback - Optional fallback value if env var is not set
 * @returns The environment variable value
 * @throws Error if the environment variable is missing and no fallback is provided
 */
const required = (key, fallback) => {
    const v = process.env[key] ?? fallback;
    if (v === undefined)
        throw new Error(`Missing env ${key}`);
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
