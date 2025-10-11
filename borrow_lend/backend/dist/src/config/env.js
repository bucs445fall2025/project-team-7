import "dotenv/config";
const required = (key, fallback) => {
    const v = process.env[key] ?? fallback;
    if (v === undefined)
        throw new Error(`Missing env ${key}`);
    return v;
};
export const env = {
    NODE_ENV: process.env.NODE_ENV ?? "development",
    PORT: parseInt(process.env.PORT || "8000", 10),
    DATABASE_URL: required("DATABASE_URL"),
    JWT_SECRET: required("JWT_SECRET"),
    CORS_ORIGIN: process.env.CORS_ORIGIN || "*"
};
