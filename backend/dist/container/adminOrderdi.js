"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOrderController = void 0;
const adminOrderRepository_1 = require("../repositories/adminOrderRepository");
const adminOrderService_1 = require("../services/adminOrderService");
const adminOrderController_1 = require("../controllers/adminOrderController");
const adminOrderRepository = new adminOrderRepository_1.AdminOrderRepository();
const adminOrderService = new adminOrderService_1.AdminOrderService(adminOrderRepository);
exports.adminOrderController = new adminOrderController_1.AdminOrderController(adminOrderService);
//# sourceMappingURL=adminOrderdi.js.map