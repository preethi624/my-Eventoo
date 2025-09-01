"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_di_1 = require("../../container/middleware.di");
const adminOrderdi_1 = require("../../container/adminOrderdi");
const router = express_1.default.Router();
router.get("/order", middleware_di_1.authMiddlewarwSet.adminOnly, adminOrderdi_1.adminOrderController.getAllOrders.bind(adminOrderdi_1.adminOrderController));
router.get("/dashboardOrders", middleware_di_1.authMiddlewarwSet.adminOnly, adminOrderdi_1.adminOrderController.getDashboardOrders.bind(adminOrderdi_1.adminOrderController));
router.get('/details/:orderId', middleware_di_1.authMiddlewarwSet.adminOnly, adminOrderdi_1.adminOrderController.getOrderDetails.bind(adminOrderdi_1.adminOrderController));
exports.default = router;
//# sourceMappingURL=adminOrderRoutes.js.map