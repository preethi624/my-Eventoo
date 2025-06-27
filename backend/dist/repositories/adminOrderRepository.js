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
}
exports.AdminOrderRepository = AdminOrderRepository;
//# sourceMappingURL=adminOrderRepository.js.map