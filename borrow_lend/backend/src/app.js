"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var helmet_1 = require("helmet");
var env_js_1 = require("./config/env.js");
var auth_js_1 = require("./routes/auth.js");
var items_js_1 = require("./routes/items.js");
var requests_js_1 = require("./routes/requests.js");
var categories_js_1 = require("./routes/categories.js");
/**
 * Express application instance
 * Configures middleware and routes for the Borrow & Lend API
 */
var app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
// CORS configuration
app.use((0, cors_1.default)({ origin: env_js_1.env.CORS_ORIGIN, credentials: true }));
// JSON body parser
app.use(express_1.default.json());
/**
 * Root endpoint - API information
 *
 * @param _req - Express request object (unused)
 * @param res - Express response object
 * @returns JSON with API information and available endpoints
 */
app.get("/", function (_req, res) { return res.json({
    message: "Borrow & Lend API",
    version: "1.0.0",
    endpoints: {
        health: "/health",
        auth: "/api/auth",
        items: "/api/items",
        requests: "/api/requests",
        categories: "/api/categories"
    }
}); });
/**
 * Health check endpoint
 *
 * @param _req - Express request object (unused)
 * @param res - Express response object
 * @returns JSON with health status
 */
app.get("/health", function (_req, res) { return res.json({ ok: true }); });
// API routes
app.use("/api/auth", auth_js_1.default);
app.use("/api/items", items_js_1.default);
app.use("/api/requests", requests_js_1.default);
app.use("/api/categories", categories_js_1.default);
/**
 * Global error handler middleware
 * Catches all unhandled errors and returns appropriate response
 *
 * @param err - Error object
 * @param _req - Express request object (unused)
 * @param res - Express response object
 * @param _next - Express next middleware function (unused)
 */
app.use(function (err, _req, res, _next) {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});
exports.default = app;
