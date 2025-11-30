import app from "./app.js";
import { env } from "./config/env.js";
/**
 * Starts the Express server and handles graceful shutdown
 */
const server = app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`);
});
/**
 * Graceful shutdown handler
 * Closes server and database connections on process termination
 */
const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
        console.log("HTTP server closed");
        process.exit(0);
    });
};
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
/**
 * Handles uncaught exceptions and unhandled promise rejections
 */
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    process.exit(1);
});
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
    process.exit(1);
});
