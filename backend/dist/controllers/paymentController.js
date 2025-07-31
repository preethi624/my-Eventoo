"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const statusCodeEnum_1 = require("../constants/statusCodeEnum");
const messages_1 = require("../constants/messages");
class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const response = yield this.paymentService.orderCreate(data);
                if (response.success && response.order) {
                    res.json({ message: "order created", success: true, order: response.order });
                }
                else {
                    res.json({ success: false, message: "failed to create order" });
                }
            }
            catch (error) {
                console.error("Error in createOrder:", error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.MESSAGES.COMMON.SERVER_ERROR,
                });
            }
        });
    }
    createFreeOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const response = yield this.paymentService.orderCreateFree(data);
                if (response.success) {
                    res.json({ message: "order created", success: true });
                }
                else {
                    res.json({ success: false, message: "failed to create order" });
                }
            }
            catch (error) {
                console.error("Error in createOrder:", error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.MESSAGES.COMMON.SERVER_ERROR,
                });
            }
        });
    }
    verifyPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const response = yield this.paymentService.paymentVerify(data);
                if (response.success) {
                    res.json({ message: "Payment verified successfully", success: true });
                }
                else {
                    res.json({ success: false, message: "Payment verification failed" });
                }
            }
            catch (error) {
                console.error("Error in payment verification :", error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.MESSAGES.COMMON.SERVER_ERROR,
                });
            }
        });
    }
    failurePayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { payStatus, orderId, userId } = req.body;
                const response = yield this.paymentService.paymentFailure(payStatus, orderId, userId);
                if (response.success) {
                    res.json({ message: "failure status updated successfully", success: true });
                }
                else {
                    res.json({ success: false, message: "status updation failed failed" });
                }
            }
            catch (error) {
                console.error("Error in payment verification :", error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.MESSAGES.COMMON.SERVER_ERROR,
                });
            }
        });
    }
    getOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const limit = req.query.limit ? parseInt(req.query.limit, 10) : 5;
                const page = req.query.page ? parseInt(req.query.page, 10) : 1;
                const searchTerm = req.query.searchTerm;
                const status = req.query.status;
                if (!userId) {
                    throw new Error("id not get");
                }
                const response = yield this.paymentService.ordersGet(userId, limit, page, searchTerm, status);
                if (response.success) {
                    res.json({ message: response.message, success: true, order: response.order });
                }
                else {
                    res.json({ message: "failed to fetch orders", success: false });
                }
            }
            catch (error) {
                console.error("Error in payment verification :", error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.MESSAGES.COMMON.SERVER_ERROR,
                });
            }
        });
    }
    getOrderById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, orderId } = req.params;
                const response = yield this.paymentService.orderGetById(userId, orderId);
                if (response.success) {
                    res.json({ message: response.message, success: true, order: response.order });
                }
                else {
                    res.json({ message: "failed to fetch orders", success: false });
                }
            }
            catch (error) {
                console.error("Error in payment verification :", error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.MESSAGES.COMMON.SERVER_ERROR,
                });
            }
        });
    }
    getOrdersById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                console.log("tuserIs", userId);
                if (!userId) {
                    throw new Error("userId not get");
                }
                const response = yield this.paymentService.ordersGetById(userId);
                if (response) {
                    res.json({ totalSpent: response.totalSpent, eventsBooked: response.eventsBooked });
                }
            }
            catch (error) {
                console.error("Error in payment verification :", error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    }
    findOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderId = req.params.orderId;
                const response = yield this.paymentService.orderFind(orderId);
                if (response) {
                    res.json({ response });
                }
            }
            catch (error) {
                console.error("Error in payment verification :", error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.MESSAGES.COMMON.SERVER_ERROR,
                });
            }
        });
    }
    getTickets(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderId = req.params.orderId;
                const response = yield this.paymentService.ticketsGet(orderId);
                if (response) {
                    res.json({ result: response.result, success: true });
                }
                else {
                    res.json({ success: false });
                }
            }
            catch (error) {
                console.error("Error in payment verification :", error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.MESSAGES.COMMON.SERVER_ERROR,
                });
            }
        });
    }
    getTicketDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const searchTerm = req.query.searchTerm;
                const status = req.query.status;
                const response = yield this.paymentService.ticketDetailsGet(userId, searchTerm, status);
                if (response) {
                    res.json({ result: response.tickets, success: true });
                }
                else {
                    res.json({ success: false });
                }
            }
            catch (error) {
                console.error("Error in payment verification :", error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.MESSAGES.COMMON.SERVER_ERROR,
                });
            }
        });
    }
}
exports.PaymentController = PaymentController;
//# sourceMappingURL=paymentController.js.map