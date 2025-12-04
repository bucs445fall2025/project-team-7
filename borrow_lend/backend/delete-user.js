"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
/**
 * Deletes a user and all related data
 *
 * @param userId - The ID of the user to delete
 */
function deleteUser(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var userItems, _i, userItems_1, item, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 11, 12, 14]);
                    console.log("Deleting user ".concat(userId, " and all related data..."));
                    // Delete messages sent or received by the user
                    return [4 /*yield*/, prisma.message.deleteMany({
                            where: {
                                OR: [
                                    { senderId: userId },
                                    { receiverId: userId }
                                ]
                            }
                        })];
                case 1:
                    // Delete messages sent or received by the user
                    _a.sent();
                    // Delete conversations involving the user
                    return [4 /*yield*/, prisma.conversation.deleteMany({
                            where: {
                                OR: [
                                    { user1Id: userId },
                                    { user2Id: userId }
                                ]
                            }
                        })];
                case 2:
                    // Delete conversations involving the user
                    _a.sent();
                    // Delete borrow requests made by the user
                    return [4 /*yield*/, prisma.borrowRequest.deleteMany({
                            where: { borrowerId: userId }
                        })];
                case 3:
                    // Delete borrow requests made by the user
                    _a.sent();
                    return [4 /*yield*/, prisma.item.findMany({
                            where: { ownerId: userId },
                            select: { id: true }
                        })];
                case 4:
                    userItems = _a.sent();
                    _i = 0, userItems_1 = userItems;
                    _a.label = 5;
                case 5:
                    if (!(_i < userItems_1.length)) return [3 /*break*/, 8];
                    item = userItems_1[_i];
                    // Delete borrow requests for this item
                    return [4 /*yield*/, prisma.borrowRequest.deleteMany({
                            where: { itemId: item.id }
                        })];
                case 6:
                    // Delete borrow requests for this item
                    _a.sent();
                    _a.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8: 
                // Delete items owned by the user
                return [4 /*yield*/, prisma.item.deleteMany({
                        where: { ownerId: userId }
                    })];
                case 9:
                    // Delete items owned by the user
                    _a.sent();
                    // Finally, delete the user
                    return [4 /*yield*/, prisma.user.delete({
                            where: { id: userId }
                        })];
                case 10:
                    // Finally, delete the user
                    _a.sent();
                    console.log("\u2705 User ".concat(userId, " and all related data deleted successfully"));
                    return [3 /*break*/, 14];
                case 11:
                    error_1 = _a.sent();
                    console.error("Error deleting user:", error_1);
                    throw error_1;
                case 12: return [4 /*yield*/, prisma.$disconnect()];
                case 13:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 14: return [2 /*return*/];
            }
        });
    });
}
// Get user ID from command line argument
var userId = process.argv[2];
if (!userId) {
    console.error("Usage: tsx delete-user.ts <userId>");
    console.error("Example: tsx delete-user.ts 1");
    process.exit(1);
}
var userIdNum = parseInt(userId, 10);
if (isNaN(userIdNum)) {
    console.error("Error: userId must be a number");
    process.exit(1);
}
deleteUser(userIdNum).catch(function (error) {
    console.error("Failed to delete user:", error);
    process.exit(1);
});
