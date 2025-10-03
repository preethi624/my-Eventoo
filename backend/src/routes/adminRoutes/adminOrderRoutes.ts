import express from "express";

import { authMiddlewarwSet } from "../../container/middleware.di";
import { adminOrderController } from "../../container/adminOrderdi";

const router = express.Router();
router.get(
  "/order",
  authMiddlewarwSet.adminOnly,
  adminOrderController.getAllOrders.bind(adminOrderController)
);
router.get(
  "/dashboardOrders",
  authMiddlewarwSet.adminOnly,
  adminOrderController.getDashboardOrders.bind(adminOrderController)
);
router.get('/details/:orderId',authMiddlewarwSet.adminOnly,adminOrderController.getOrderDetails.bind(adminOrderController))

export default router;
