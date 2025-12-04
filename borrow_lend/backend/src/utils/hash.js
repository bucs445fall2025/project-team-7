"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = exports.hash = void 0;
var bcryptjs_1 = require("bcryptjs");
/**
 * Hashes a plain text password using bcrypt
 *
 * @param pw - The plain text password to hash
 * @returns Promise resolving to the hashed password string
 */
var hash = function (pw) { return bcryptjs_1.default.hash(pw, 10); };
exports.hash = hash;
/**
 * Compares a plain text password with a hashed password
 *
 * @param pw - The plain text password to compare
 * @param hashed - The hashed password to compare against
 * @returns Promise resolving to true if passwords match, false otherwise
 */
var compare = function (pw, hashed) { return bcryptjs_1.default.compare(pw, hashed); };
exports.compare = compare;
