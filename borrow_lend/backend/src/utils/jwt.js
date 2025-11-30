"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = exports.signJwt = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var env_js_1 = require("../config/env.js");
/**
 * Signs a JWT token with user payload
 *
 * @param payload - The JWT payload containing userId
 * @param expiresIn - Token expiration time (default: "7d")
 * @returns Signed JWT token string
 */
var signJwt = function (payload, expiresIn) {
    if (expiresIn === void 0) { expiresIn = "7d"; }
    return jsonwebtoken_1.default.sign(payload, env_js_1.env.JWT_SECRET, { expiresIn: expiresIn });
};
exports.signJwt = signJwt;
/**
 * Verifies and decodes a JWT token
 *
 * @param token - The JWT token string to verify
 * @returns Decoded JWT payload containing userId
 * @throws Error if token is invalid or expired
 */
var verifyJwt = function (token) {
    return jsonwebtoken_1.default.verify(token, env_js_1.env.JWT_SECRET);
};
exports.verifyJwt = verifyJwt;
