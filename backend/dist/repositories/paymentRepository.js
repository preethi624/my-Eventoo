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
exports.PaymentRepository = void 0;
const order_1 = __importDefault(require("../model/order"));
const mongoose_1 = __importDefault(require("mongoose"));
class PaymentRepository {
    createOrder(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('repData', data);
            return yield order_1.default.create(data);
        });
    }
    updatePaymentDetails(orderId, paymentId, signature, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield order_1.default.findOneAndUpdate({ razorpayOrderId: orderId }, {
                razorpayPaymentId: paymentId,
                razorpaySignature: signature,
                status: status
            }, { new: true });
        });
    }
    getOrders(id, limit, page, searchTerm, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const orders = yield order_1.default.find({ userId: id, eventId: { $ne: null, $exists: true } }).populate({
                path: 'eventId'
            }).lean().sort({ createdAt: -1 });
            const filteredOrder = orders.filter(order => {
                var _a, _b, _c;
                if (!order.eventId)
                    return;
                const event = order.eventId;
                const eventTitle = ((_a = event.title) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
                const orderId = ((_b = order.orderId) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || '';
                const search = (searchTerm === null || searchTerm === void 0 ? void 0 : searchTerm.toLowerCase()) || '';
                const matchSearch = eventTitle.includes(search) || orderId.includes(search);
                const matchStatus = !status || status === 'all' || ((_c = order.status) === null || _c === void 0 ? void 0 : _c.toLowerCase()) === status.toLowerCase();
                return matchSearch && matchStatus;
            });
            const totalPages = Math.ceil(filteredOrder.length / limit);
            const paginatedOrders = filteredOrder.slice(skip, skip + limit);
            const formatedOrders = paginatedOrders.map(order => {
                return Object.assign(Object.assign({}, order), { eventDetails: order.eventId, eventId: order.eventId._id });
            });
            return {
                orders: formatedOrders,
                totalPages,
                currentPage: page
            };
        });
    }
    getOrderById(userId, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield order_1.default.findOne({ userId: userId, _id: orderId }).populate({ path: 'eventId' });
        });
    }
    failurePayment(payStatus, orderId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("orderId", orderId);
            return yield order_1.default.findOneAndUpdate({ userId, _id: orderId }, { status: payStatus }, { new: true });
        });
    }
    getOrdersById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [stats] = yield order_1.default.aggregate([
                    { $match: { userId: new mongoose_1.default.Types.ObjectId(userId), status: 'paid' } },
                    {
                        $group: {
                            _id: '$userId',
                            totalSpent: { $sum: { $divide: ['$amount', 100] } },
                            eventsBooked: { $sum: 1 },
                        },
                    },
                ]);
                return {
                    success: true,
                    totalSpent: (stats === null || stats === void 0 ? void 0 : stats.totalSpent) || 0,
                    eventsBooked: (stats === null || stats === void 0 ? void 0 : stats.eventsBooked) || 0,
                };
            }
            catch (error) {
                console.error('Error fetching user stats:', error);
                return { success: false, message: 'Failed to fetch stats' };
            }
        });
    }
}
exports.PaymentRepository = PaymentRepository;
//# sourceMappingURL=paymentRepository.js.map