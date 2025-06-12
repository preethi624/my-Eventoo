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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const razorpay_1 = __importDefault(require("razorpay"));
const generateOrderId_1 = require("../utils/generateOrderId");
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});
class PaymentService {
    constructor(paymentRepository, eventRepository) {
        this.paymentRepository = paymentRepository;
        this.eventRepository = eventRepository;
    }
    orderCreate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const orderId = (0, generateOrderId_1.generateOrderId)();
            try {
                const totalPrice = data.totalPrice;
                const ticketCount = data.ticketCount;
                const userId = data.userId;
                const eventId = data.eventId;
                const eventTitle = data.eventTitle;
                const createdAt = new Date();
                const options = {
                    amount: totalPrice * 100,
                    currency: "INR",
                    receipt: "receipt_order_74394"
                };
                const order = yield razorpay.orders.create(options);
                const response = yield this.paymentRepository.createOrder({
                    razorpayOrderId: order.id,
                    amount: Number(order.amount),
                    currency: order.currency,
                    receipt: (_a = order.receipt) !== null && _a !== void 0 ? _a : "default_receipt_id",
                    status: order.status,
                    ticketCount,
                    userId,
                    eventId,
                    eventTitle,
                    createdAt,
                    orderId: orderId
                });
                if (response) {
                    return ({ success: true, message: "order created successfully", order: response });
                }
                else {
                    return ({ success: false, message: "failed to create order" });
                }
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "not creating order" };
            }
        });
    }
    paymentVerify(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const razorpay_payment_id = data.razorpay_payment_id;
                const razorpay_order_id = data.razorpay_order_id;
                const razorpay_signature = data.razorpay_signature;
                const secret = process.env.RAZORPAY_KEY_SECRET;
                if (!secret) {
                    throw new Error("RAZORPAY_KEY_SECRET is not defined in environment variables.");
                }
                const hmac = crypto_1.default.createHmac('sha256', secret);
                hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
                const generatedSignature = hmac.digest('hex');
                if (generatedSignature === razorpay_signature) {
                    const updatedOrder = yield this.paymentRepository.updatePaymentDetails(razorpay_order_id, razorpay_payment_id, razorpay_signature, 'paid');
                    if (updatedOrder) {
                        yield this.eventRepository.decrementAvailableTickets(updatedOrder.eventId.toString(), updatedOrder.ticketCount);
                    }
                    else {
                        console.warn("No matching order found for Razorpay Order ID:", razorpay_order_id);
                    }
                    return { success: true, message: "Payment verified successfully" };
                }
                else {
                    yield this.paymentRepository.updatePaymentDetails(razorpay_order_id, razorpay_payment_id, razorpay_signature, 'failed');
                    return { success: false, message: "Payment not verified" };
                }
            }
            catch (error) {
                console.error(error);
                if (data.razorpay_order_id) {
                    yield this.paymentRepository.updatePaymentDetails(data.razorpay_order_id, data.razorpay_payment_id || '', data.razorpay_signature || '', 'failed');
                }
                return { success: false, message: "Payment not verified" };
            }
        });
    }
    paymentFailure(payStatus, orderId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.paymentRepository.failurePayment(payStatus, orderId, userId);
                if (response) {
                    return { success: true, message: "status updated" };
                }
                else {
                    return { success: false, message: "failed to update status" };
                }
            }
            catch (error) {
                console.log(error);
                return { success: false, message: "failr=ed to update" };
            }
        });
    }
    ordersGet(id, limit, page, searchTerm, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.paymentRepository.getOrders(id, limit, page, searchTerm, status);
                if (result) {
                    return { success: true, message: "orders fetched successfully", order: result };
                }
                else {
                    return { success: false, message: "failed to fetch" };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "failed to fetch orders" };
            }
        });
    }
    orderGetById(userId, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.paymentRepository.getOrderById(userId, orderId);
                if (result) {
                    return { success: true, message: "orders fetched successfully", order: result };
                }
                else {
                    return { success: false, message: "failed to fetch" };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "failed to fetch orders" };
            }
        });
    }
    ordersGetById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.paymentRepository.getOrdersById(userId);
                if (result) {
                    return { success: true, totalSpent: result.totalSpent, eventsBooked: result.eventsBooked };
                }
                else {
                    return { success: false, message: "failed to fetch" };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "failed to fetch orders" };
            }
        });
    }
}
exports.PaymentService = PaymentService;
//# sourceMappingURL=paymentService.js.map