import  express  from "express";
import { authMiddlewarwSet } from "../../container/middleware.di";
import { paymentController } from "../../container/userPaymentdi";
const router=express.Router();
router.post('/order',authMiddlewarwSet.userOnly,paymentController.createOrder.bind(paymentController));
router.post('/verify',authMiddlewarwSet.userOnly,paymentController.verifyPayment.bind(paymentController));
router.post('/failure',authMiddlewarwSet.userOnly,paymentController.failurePayment.bind(paymentController));

router.get('/orders/:id',authMiddlewarwSet.userOnly,paymentController.getOrders.bind(paymentController));
router.get('/order/:userId/:orderId',authMiddlewarwSet.userAndOrganiser,paymentController.getOrderById.bind(paymentController));
router.get('/order/:userId',authMiddlewarwSet.userOnly,paymentController.getOrdersById.bind(paymentController));

export default router