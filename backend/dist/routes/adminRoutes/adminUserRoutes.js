"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_di_1 = require("../../container/middleware.di");
const adminUser_di_1 = require("../../container/adminUser.di");
const router = express_1.default.Router();
router.get('/users', middleware_di_1.authMiddlewarwSet.adminOnly, adminUser_di_1.adminController.getAllUsers.bind(adminUser_di_1.adminController));
router.put('/user/:id', middleware_di_1.authMiddlewarwSet.adminOnly, adminUser_di_1.adminController.updateUser.bind(adminUser_di_1.adminController));
router.put('/user', middleware_di_1.authMiddlewarwSet.adminOnly, adminUser_di_1.adminController.blockUser.bind(adminUser_di_1.adminController));
exports.default = router;
//# sourceMappingURL=adminUserRoutes.js.map