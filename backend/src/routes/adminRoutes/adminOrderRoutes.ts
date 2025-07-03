import express from 'express';



import { authMiddlewarwSet } from '../../container/middleware.di';
import { adminOrderController } from '../../container/adminOrderdi';


const router = express.Router();
router.get('/order',authMiddlewarwSet.adminOnly,adminOrderController.getAllOrders.bind(adminOrderController));
router.get("/dashboardOrders",authMiddlewarwSet.adminOnly,adminOrderController.getDashboardOrders.bind(adminOrderController))

export default router