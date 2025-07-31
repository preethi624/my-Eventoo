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
exports.AdminOrderRepository = void 0;
const order_1 = __importDefault(require("../model/order"));
const platformSettings_1 = __importDefault(require("../model/platformSettings"));
class AdminOrderRepository {
    getOrdersAll(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { searchTerm = '', statusFilter = '', selectedDate = '', page = 1, limit = 6, organiser = '', user = '' } = filters;
            const skip = (page - 1) * limit;
            const match = {};
            // Filter by booking status
            if (statusFilter) {
                match.bookingStatus = { $regex: statusFilter, $options: 'i' };
            }
            // Filter by createdAt date
            if (selectedDate) {
                const date = new Date(selectedDate);
                date.setHours(0, 0, 0, 0);
                const nextDay = new Date(date);
                nextDay.setDate(date.getDate() + 1);
                match.createdAt = { $gte: date, $lt: nextDay };
            }
            // Build aggregation pipeline
            const pipeline = [
                {
                    $lookup: {
                        from: 'events',
                        localField: 'eventId',
                        foreignField: '_id',
                        as: 'eventDetails',
                    },
                },
                { $unwind: '$eventDetails' },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userDetails',
                    },
                },
                { $unwind: '$userDetails' },
                {
                    $lookup: {
                        from: 'organisers',
                        localField: 'eventDetails.organiser',
                        foreignField: '_id',
                        as: 'organiserDetails',
                    },
                },
                { $unwind: '$organiserDetails' },
                {
                    $match: Object.assign(Object.assign(Object.assign(Object.assign({}, match), (searchTerm
                        ? {
                            $or: [
                                { 'eventDetails.title': { $regex: searchTerm, $options: 'i' } },
                                { _id: { $regex: searchTerm, $options: 'i' } },
                            ],
                        }
                        : {})), (organiser
                        ? { 'organiserDetails.name': { $regex: organiser, $options: 'i' } }
                        : {})), (user
                        ? { 'userDetails.name': { $regex: user, $options: 'i' } }
                        : {})),
                },
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: limit },
            ];
            const [orders, countData] = yield Promise.all([
                order_1.default.aggregate(pipeline),
                order_1.default.aggregate([
                    ...pipeline.slice(0, -2), // remove skip & limit
                    { $count: 'total' },
                ]),
            ]);
            const totalCount = ((_a = countData[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
            return {
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page,
                orders,
            };
        });
    }
    getDashboardOrders(timeFrame, startDate, endDate, category, month, year) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            /*let stDate: Date;
            let enDate: Date | undefined;
          
            if (startDate && endDate) {
              stDate = new Date(startDate);
              enDate = new Date(endDate);
            } else {
              const days = timeFrame === '7d' ? 7 : timeFrame === '30d' ? 30 : 90;
              stDate = new Date();
              stDate.setDate(stDate.getDate() - days);
            }*/
            let stDate;
            let enDate;
            if (startDate && endDate) {
                stDate = new Date(startDate);
                enDate = new Date(endDate);
            }
            else if (month || year) {
                const targetYear = parseInt(year !== null && year !== void 0 ? year : new Date().getFullYear().toString());
                const targetMonth = month ? parseInt(month) : 0;
                stDate = new Date(targetYear, targetMonth, 1);
                if (month) {
                    enDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);
                }
                else {
                    enDate = new Date(targetYear, 11, 31, 23, 59, 59, 999);
                }
            }
            else if (!month && !year) {
                const targetYear = parseInt(new Date().getFullYear().toString());
                stDate = new Date(targetYear, 0, 1);
                enDate = new Date(targetYear, 11, 31, 23, 59, 59, 999);
            }
            else {
                const days = timeFrame === '7d' ? 7 : timeFrame === '30d' ? 30 : 90;
                stDate = new Date();
                stDate.setDate(stDate.getDate() - days);
            }
            const eventMatchCondition = {
                'eventDetails.status': 'completed',
                createdAt: enDate ? { $gte: stDate, $lte: enDate } : { $gte: stDate },
            };
            if (category) {
                eventMatchCondition['eventDetails.category'] = category;
            }
            const orders = yield order_1.default.aggregate([
                { $sort: { createdAt: -1 } },
                { $limit: 5 },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user',
                    },
                },
                { $unwind: '$user' },
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
                    $lookup: {
                        from: 'organisers',
                        localField: 'event.organiser',
                        foreignField: '_id',
                        as: 'organiser',
                    },
                },
                { $unwind: '$organiser' },
                {
                    $project: {
                        _id: 0,
                        date: '$createdAt',
                        id: '$orderId',
                        user: '$user.name',
                        event: '$event.title',
                        eventDate: '$event.date',
                        eventStatus: '$event.status',
                        organiserName: '$organiser.name',
                        organiserEmail: '$organiser.email',
                        amount: 1,
                        status: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ['$bookingStatus', 'confirmed'] }, then: 'Completed' },
                                    { case: { $eq: ['$bookingStatus', 'cancelled'] }, then: 'Failed' },
                                ],
                                default: 'Pending',
                            },
                        },
                    },
                },
            ]);
            const settings = yield platformSettings_1.default.findOne();
            const adminCommissionPercentage = (_a = settings === null || settings === void 0 ? void 0 : settings.adminCommissionPercentage) !== null && _a !== void 0 ? _a : 10;
            const salesReport = yield order_1.default.aggregate([
                {
                    $lookup: {
                        from: 'events',
                        localField: 'eventId',
                        foreignField: '_id',
                        as: 'eventDetails',
                    },
                },
                { $unwind: '$eventDetails' },
                {
                    $lookup: {
                        from: 'organisers',
                        localField: 'eventDetails.organiser',
                        foreignField: '_id',
                        as: 'organiserDetails',
                    },
                },
                { $unwind: '$organiserDetails' },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userDetails',
                    },
                },
                { $unwind: '$userDetails' },
                { $match: eventMatchCondition },
                { $addFields: {
                        adminEarning: {
                            $multiply: [
                                {
                                    $divide: [
                                        { $multiply: ["$amount", adminCommissionPercentage] },
                                        100
                                    ]
                                },
                                "$ticketCount"
                            ]
                        }
                    } },
                {
                    $project: {
                        _id: 0,
                        event: '$eventDetails.title',
                        eventDate: '$eventDetails.date',
                        ticketPrice: '$eventDetails.ticketPrice',
                        user: '$userDetails.name',
                        organiserName: '$organiserDetails.name',
                        organiserEmail: '$organiserDetails.email',
                        adminEarning: 1,
                    },
                },
            ]);
            const totalAdminEarning = salesReport.reduce((sum, record) => sum + (record.adminEarning || 0), 0) / 100;
            return { orders, salesReport, totalAdminEarning };
        });
    }
}
exports.AdminOrderRepository = AdminOrderRepository;
//# sourceMappingURL=adminOrderRepository.js.map