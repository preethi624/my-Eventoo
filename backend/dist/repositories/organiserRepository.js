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
exports.OrganiserRepository = void 0;
const organiser_1 = __importDefault(require("../model/organiser"));
const order_1 = __importDefault(require("../model/order"));
const event_1 = __importDefault(require("../model/event"));
const venue_1 = __importDefault(require("../model/venue"));
const mongoose_1 = __importDefault(require("mongoose"));
const analyticHelper_1 = require("../utils/analyticHelper");
const platformSettings_1 = __importDefault(require("../model/platformSettings"));
class OrganiserRepository {
    getOrganiserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield organiser_1.default.findById(id);
        });
    }
    statusCheck(emailObj) {
        return __awaiter(this, void 0, void 0, function* () {
            ;
            const { email } = emailObj;
            return yield organiser_1.default.findOne({ email });
        });
    }
    updateOrganiser(data, organiserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, phone, location, aboutMe, profileImage } = data;
            return yield organiser_1.default.findByIdAndUpdate(organiserId, { name, phone, location, aboutMe: aboutMe, profileImage }, { new: true });
        });
    }
    fetchBooking(organiserId, limit, page, searchTerm, status, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const allOrders = yield order_1.default.find().populate({
                path: 'eventId',
                select: 'title organiser ticketPrice'
            }).populate({ path: "userId" }).sort({ createdAt: -1 });
            const filteredOrder = allOrders.filter((order) => {
                var _a, _b, _c, _d;
                const event = order.eventId;
                const organiserMatch = event && event.organiser && event.organiser.toString() === organiserId;
                const search = (searchTerm === null || searchTerm === void 0 ? void 0 : searchTerm.toLowerCase()) || '';
                const eventTitle = ((_a = event === null || event === void 0 ? void 0 : event.title) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
                const orderId = ((_b = order === null || order === void 0 ? void 0 : order.orderId) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || '';
                const eventCategory = ((_c = event === null || event === void 0 ? void 0 : event.category) === null || _c === void 0 ? void 0 : _c.toLowerCase()) || '';
                const searchMatch = eventTitle.includes(search) || orderId.includes(search) || eventCategory.includes(search);
                const statusMatch = !status || status === 'all' || ((_d = order.bookingStatus) === null || _d === void 0 ? void 0 : _d.toLowerCase()) === status.toLowerCase();
                let dateMatch = true;
                if (date) {
                    const filterDate = new Date(date);
                    const orderDate = new Date(order.createdAt);
                    dateMatch =
                        filterDate.getFullYear() === orderDate.getFullYear() &&
                            filterDate.getMonth() === orderDate.getMonth() &&
                            filterDate.getDate() === orderDate.getDate();
                }
                return organiserMatch && searchMatch && statusMatch && dateMatch;
            });
            const totalOrders = filteredOrder.length;
            const paginatedOrders = filteredOrder.slice(skip, skip + limit);
            const totalPages = Math.ceil(totalOrders / limit);
            return {
                result: paginatedOrders,
                totalPages,
                currentPage: page
            };
        });
    }
    getOrderDetails(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("orderId", orderId);
            const cleanOrderId = orderId.replace(/^:/, '');
            return yield order_1.default.findOne({ _id: cleanOrderId }).populate('eventId').populate({ path: "userId" });
        });
    }
    orgReapply(organiserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield organiser_1.default.findByIdAndUpdate(organiserId, { status: "pending" }, { new: true });
        });
    }
    getVenues(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = filters.limit && filters.page ? (filters.page - 1) * filters.limit : 0;
            const query = {};
            if (filters.nameSearch) {
                query.name = { $regex: filters.nameSearch, $options: 'i' };
            }
            if (filters.locationSearch) {
                query.city = { $regex: filters.locationSearch, $options: 'i' };
            }
            const venues = yield venue_1.default.find(query).skip(skip).limit(Number(filters.limit));
            const total = yield venue_1.default.countDocuments(query);
            return { venues, totalPages: filters.limit ? Math.ceil(total / filters.limit) : 0,
                currentPage: filters.page, };
        });
    }
    getVenueById(venueId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield venue_1.default.findById(venueId);
        });
    }
    getDashboard(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectId = new mongoose_1.default.Types.ObjectId(eventId);
            const event = yield event_1.default.findById(objectId).lean();
            const orders = yield order_1.default.aggregate([
                { $match: { eventId: objectId } },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                { $unwind: '$user' },
                {
                    $project: {
                        orderId: 1,
                        amount: 1,
                        ticketCount: 1,
                        status: 1,
                        bookingStatus: 1,
                        createdAt: 1,
                        userId: {
                            name: '$user.name',
                            email: '$user.email'
                        },
                    }
                }
            ]);
            const stats = {
                confirmed: orders.filter(o => o.bookingStatus === 'confirmed').length,
                pending: orders.filter(o => o.bookingStatus === 'pending').length,
                cancelled: orders.filter(o => o.bookingStatus === 'cancelled').length,
                salesTrend: (0, analyticHelper_1.generateSalesTrend)(orders)
            };
            return { event, orders, stats };
        });
    }
    fetchAttendees(eventId, organiserId, searchTerm, filterStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const settings = yield platformSettings_1.default.findOne();
            const adminCommissionPercentage = (_a = settings === null || settings === void 0 ? void 0 : settings.adminCommissionPercentage) !== null && _a !== void 0 ? _a : 10;
            const matchStage = {
                eventId: new mongoose_1.default.Types.ObjectId(eventId),
            };
            if (filterStatus && filterStatus !== 'all') {
                matchStage.bookingStatus = filterStatus;
            }
            // If searchTerm is provided, add case-insensitive search on name or email
            const pipeline = [
                { $match: matchStage },
                {
                    $lookup: {
                        from: 'events',
                        localField: 'eventId',
                        foreignField: '_id',
                        as: 'eventDetails'
                    }
                },
                { $unwind: '$eventDetails' },
                {
                    $match: {
                        'eventDetails.organiser': new mongoose_1.default.Types.ObjectId(organiserId),
                        'eventDetails.status': 'completed'
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: 'userId',
                        foreignField: "_id",
                        as: "userDetails"
                    }
                },
                { $unwind: "$userDetails" }
            ];
            if (searchTerm) {
                pipeline.push({
                    $match: {
                        $or: [
                            { "userDetails.name": { $regex: searchTerm, $options: 'i' } },
                            { "userDetails.email": { $regex: searchTerm, $options: 'i' } },
                        ]
                    }
                });
            }
            pipeline.push({
                $project: {
                    _id: 0,
                    id: '$_id',
                    name: '$userDetails.name',
                    email: '$userDetails.email',
                    ticketCount: 1,
                    createdAt: 1,
                    bookingStatus: 1,
                    orderId: 1,
                    amount: 1
                }
            });
            const attendee = yield order_1.default.aggregate(pipeline);
            const totalRevenue = attendee.reduce((acc, curr) => {
                if ((curr === null || curr === void 0 ? void 0 : curr.bookingStatus) === "confirmed") {
                    acc += curr.amount / 100;
                }
                return acc;
            }, 0);
            const actualRevenue = totalRevenue * (1 - adminCommissionPercentage / 100);
            return { attendees: attendee, revenue: actualRevenue };
        });
    }
}
exports.OrganiserRepository = OrganiserRepository;
//# sourceMappingURL=organiserRepository.js.map