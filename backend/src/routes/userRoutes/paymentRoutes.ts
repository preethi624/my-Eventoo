import  express  from "express";
import { authMiddlewarwSet } from "../../container/middleware.di";
import { paymentController } from "../../container/userPaymentdi";
const router=express.Router();
router.post('/order',authMiddlewarwSet.userOnly,paymentController.createOrder.bind(paymentController));
router.post('/verify',authMiddlewarwSet.userOnly,paymentController.verifyPayment.bind(paymentController));
router.post('/failure',authMiddlewarwSet.userOnly,paymentController.failurePayment.bind(paymentController));
router.post('/freeOrder',authMiddlewarwSet.userOnly,paymentController.createFreeOrder.bind(paymentController))

router.get('/orders/:userId',authMiddlewarwSet.userOnly,paymentController.getOrders.bind(paymentController));
router.get('/order/:userId/:orderId',authMiddlewarwSet.userAndOrganiser,paymentController.getOrderById.bind(paymentController));
router.get('/order',authMiddlewarwSet.userOnly,paymentController.getOrdersById.bind(paymentController));
router.post('/order/:orderId',authMiddlewarwSet.userOnly,paymentController.findOrder.bind(paymentController));
router.get('/tickets/:orderId',authMiddlewarwSet.userOnly,paymentController.getTickets.bind(paymentController));
router.get('/ticketDetails/:userId',authMiddlewarwSet.userOnly,paymentController.getTicketDetails.bind(paymentController));



export default router