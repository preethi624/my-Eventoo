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
const event_1 = __importDefault(require("../model/event"));
const uuid_1 = require("uuid");
const ticket_1 = require("../model/ticket");
class PaymentRepository {
    createOrder(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('repData', data);
            return yield order_1.default.create(data);
        });
    }
    createOrderFree(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield order_1.default.create(data);
        });
    }
    updatePaymentDetails(orderId, paymentId, signature, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateOrder = yield order_1.default.findOneAndUpdate({ razorpayOrderId: orderId }, {
                razorpayPaymentId: paymentId,
                razorpaySignature: signature,
                status: status,
                bookingStatus: "confirmed"
            }, { new: true });
            if (updateOrder && updateOrder.eventId && updateOrder.ticketCount && updateOrder.bookingStatus === "confirmed") {
                yield event_1.default.findByIdAndUpdate(updateOrder.eventId._id, { $inc: { ticketsSold: updateOrder.ticketCount } });
                const ticketsToInsert = [];
                for (let i = 0; i < updateOrder.ticketCount; i++) {
                    ticketsToInsert.push({
                        userId: updateOrder.userId,
                        orderId: updateOrder._id,
                        eventId: updateOrder.eventId,
                        qrToken: (0, uuid_1.v4)(),
                        issuedAt: new Date(),
                        checkedIn: false
                    });
                }
                yield ticket_1.TicketModel.insertMany(ticketsToInsert);
            }
            return order_1.default.findById(updateOrder === null || updateOrder === void 0 ? void 0 : updateOrder._id).populate("eventId").exec();
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
                const matchStatus = !status || status === 'all' || ((_c = order.bookingStatus) === null || _c === void 0 ? void 0 : _c.toLowerCase()) === status.toLowerCase();
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
    findOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield order_1.default.findById({ _id: orderId });
        });
    }
    updateRefund(refundId, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("refundid", refundId);
                const order = yield order_1.default.findById(orderId);
                if (!order)
                    throw new Error('Order not found');
                const eventId = order.eventId;
                const ticketCount = order.ticketCount;
                yield order_1.default.findByIdAndUpdate(orderId, { refundId: refundId, status: "refunded", bookingStatus: "cancelled" });
                yield event_1.default.findByIdAndUpdate(eventId, { $inc: { availableTickets: ticketCount } });
                return { success: true };
            }
            catch (error) {
                console.log(error);
                return { success: false, message: "Failed to refund" };
            }
        });
    }
    getTickets(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tickets = yield ticket_1.TicketModel.find({ orderId: orderId }).populate('eventId').exec();
            return tickets;
        });
    }
    getTicketDetails(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, searchTerm = '', status = "") {
            const matchStage = {
                $match: {
                    userId: new mongoose_1.default.Types.ObjectId(userId),
                },
            };
            const pipeline = [
                matchStage,
                {
                    $lookup: {
                        from: 'events',
                        localField: 'eventId',
                        foreignField: '_id',
                        as: 'event',
                    },
                },
                { $unwind: '$event' },
                {
                    $addFields: {
                        normalizedTitle: {
                            $replaceAll: {
                                input: { $toLower: '$event.title' },
                                find: ' ',
                                replacement: '',
                            }
                        },
                        normalizedVenue: {
                            $replaceAll: {
                                input: { $toLower: '$event.venue' },
                                find: ' ',
                                replacement: '',
                            }
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'orders',
                        localField: 'orderId',
                        foreignField: '_id',
                        as: 'order',
                    },
                },
                { $unwind: '$order' },
            ];
            if (searchTerm.trim() !== "") {
                const cleanedSearch = searchTerm.trim().replace(/\s/g, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&').toLowerCase();
                const regex = new RegExp(cleanedSearch, 'i');
                pipeline.push({ $match: { $or: [{ normalizedTitle: regex }, { normalizedVenue: regex }] } });
            }
            const now = new Date();
            if (status === 'upcoming') {
                pipeline.push({ $match: { 'event.date': { $gte: now } } });
            }
            else if (status === 'past') {
                pipeline.push({ $match: { 'event.date': { $lt: now } } });
            }
            pipeline.push({
                $project: {
                    _id: 1,
                    userId: 1,
                    qrToken: 1,
                    issuedAt: 1,
                    checkedIn: 1,
                    orderId: '$order._id',
                    eventId: '$event._id',
                    event: {
                        _id: '$event._id',
                        title: '$event.title',
                        description: '$event.description',
                        date: '$event.date',
                        time: '$event.time',
                        venue: '$event.venue',
                        image: '$event.images',
                        category: '$event.category',
                    },
                    order: {
                        _id: '$order._id',
                        totalAmount: '$order.amount',
                        status: '$order.status',
                    },
                },
            });
            const tickets = yield ticket_1.TicketModel.aggregate(pipeline);
            return tickets;
        });
    }
}
exports.PaymentRepository = PaymentRepository;
//# sourceMappingURL=paymentRepository.js.map