"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_di_1 = require("../../container/middleware.di");
const userPaymentdi_1 = require("../../container/userPaymentdi");
const router = express_1.default.Router();
router.post("/order", middleware_di_1.authMiddlewarwSet.userOnly, userPaymentdi_1.paymentController.createOrder.bind(userPaymentdi_1.paymentController));
router.post("/verify", middleware_di_1.authMiddlewarwSet.userOnly, userPaymentdi_1.paymentController.verifyPayment.bind(userPaymentdi_1.paymentController));
router.post("/failure", middleware_di_1.authMiddlewarwSet.userOnly, userPaymentdi_1.paymentController.failurePayment.bind(userPaymentdi_1.paymentController));
router.post("/freeOrder", middleware_di_1.authMiddlewarwSet.userOnly, userPaymentdi_1.paymentController.createFreeOrder.bind(userPaymentdi_1.paymentController));
router.get("/orders/:userId", middleware_di_1.authMiddlewarwSet.userOnly, userPaymentdi_1.paymentController.getOrders.bind(userPaymentdi_1.paymentController));
router.get("/order/:userId/:orderId", middleware_di_1.authMiddlewarwSet.userAndOrganiser, userPaymentdi_1.paymentController.getOrderById.bind(userPaymentdi_1.paymentController));
router.get("/order", middleware_di_1.authMiddlewarwSet.userOnly, userPaymentdi_1.paymentController.getOrdersById.bind(userPaymentdi_1.paymentController));
router.post("/order/:orderId", middleware_di_1.authMiddlewarwSet.userOnly, userPaymentdi_1.paymentController.findOrder.bind(userPaymentdi_1.paymentController));
router.get("/tickets/:orderId", middleware_di_1.authMiddlewarwSet.userOnly, userPaymentdi_1.paymentController.getTickets.bind(userPaymentdi_1.paymentController));
router.get("/ticketDetails/:userId", middleware_di_1.authMiddlewarwSet.userOnly, userPaymentdi_1.paymentController.getTicketDetails.bind(userPaymentdi_1.paymentController));
exports.default = router;
//# sourceMappingURL=paymentRoutes.js.map