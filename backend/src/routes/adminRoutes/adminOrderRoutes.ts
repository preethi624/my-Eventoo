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
<<<<<<< HEAD
router.get('/details/:orderId',authMiddlewarwSet.adminOnly,adminOrderController.getOrderDetails.bind(adminOrderController))
=======
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe

export default router;
