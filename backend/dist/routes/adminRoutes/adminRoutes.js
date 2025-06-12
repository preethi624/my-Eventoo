"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_di_1 = require("../../container/middleware.di");
const admin_di_1 = require("../../container/admin.di");
const router = express_1.default.Router();
router.get('/getAllUsers', middleware_di_1.authMiddlewarwSet.adminOnly, admin_di_1.adminController.getAllUsers.bind(admin_di_1.adminController));
router.put('/editUser/:id', middleware_di_1.authMiddlewarwSet.adminOnly, admin_di_1.adminController.updateUser.bind(admin_di_1.adminController));
router.put('/blockUser', middleware_di_1.authMiddlewarwSet.adminOnly, admin_di_1.adminController.blockUser.bind(admin_di_1.adminController));
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map