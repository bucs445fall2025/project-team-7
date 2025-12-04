"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
var jwt_js_1 = require("../utils/jwt.js");
/**
 * Express middleware to require authentication via JWT token
 * Validates Bearer token in Authorization header and attaches userId to request
 *
 * @param req - Express request object (extended with userId)
 * @param res - Express response object
 * @param next - Express next middleware function
 * @returns 401 error if token is missing or invalid, otherwise calls next()
 */
function requireAuth(req, res, next) {
    var header = req.headers["authorization"];
    if (!(header === null || header === void 0 ? void 0 : header.startsWith("Bearer ")))
        return res.status(401).json({ error: "Missing token" });
    try {
        var token = header.split(" ")[1];
        var userId = (0, jwt_js_1.verifyJwt)(token).userId;
        req.userId = userId;
        next();
    }
    catch (e) {
        return res.status(401).json({ error: "Invalid token" });
    }
}
