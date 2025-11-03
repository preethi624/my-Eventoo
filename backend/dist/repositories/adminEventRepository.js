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
exports.AdminEventRepository = void 0;
const event_1 = __importDefault(require("../model/event"));
const platformSettings_1 = __importDefault(require("../model/platformSettings"));
const notification_1 = __importDefault(require("../model/notification"));
class AdminEventRepository {
    getEventsAll(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { searchLocation, selectedCategory, maxPrice, selectedDate, searchTitle, page = 1, limit = 6, } = filters;
            console.log("limit", limit);
            const skip = (page - 1) * limit;
            const query = {};
            if (searchLocation) {
                query.venue = { $regex: searchLocation, $options: "i" };
            }
            if (searchTitle) {
                query.title = { $regex: searchTitle, $options: "i" };
            }
            if (selectedCategory) {
                query.category = selectedCategory;
            }
            if (maxPrice != undefined && maxPrice != null) {
                query.ticketPrice = { $lte: maxPrice };
            }
            if (selectedDate) {
                const date = new Date(selectedDate);
                date.setHours(0, 0, 0, 0);
                const nextDay = new Date(date);
                nextDay.setDate(date.getDate() + 1);
                query.date = { $gte: date, $lt: nextDay };
            }
            const pipeline = [
                { $match: query },
                {
                    $lookup: {
                        from: "organisers",
                        localField: "organiser",
                        foreignField: "_id",
                        as: "organiserDetails",
                    },
                },
                { $unwind: "$organiserDetails" },
            ];
            if (filters.orgName) {
                pipeline.push({
                    $match: {
                        "organiserDetails.name": {
                            $regex: filters.orgName,
                            $options: "i",
                        },
                    },
                });
            }
            pipeline.push({ $sort: { createdAt: -1 } }, { $skip: skip }, { $limit: limit });
            const events = yield event_1.default.aggregate(pipeline);
            const countPipeline = pipeline.filter((stage) => !("$skip" in stage) && !("$limit" in stage) && !("$sort" in stage));
            countPipeline.push({ $count: "total" });
            const countData = yield event_1.default.aggregate(countPipeline);
            const total = ((_a = countData[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
            return {
                totalPages: Math.ceil(total / limit),
                events,
                currentPage: page,
            };
        });
    }
    eventEdit(id, formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const event = yield event_1.default.findByIdAndUpdate(id, formData, {
                    new: true,
                });
                if (!event)
                    throw new Error("event not found");
                yield notification_1.default.create({
                    organizerId: event.organiser,
                    type: "general",
                    message: `Your event ${event.title} has been edited by admin!`,
                    isRead: false,
                });
                return event;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    blockEvent(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = event._id;
                if (!event.isBlocked) {
                    const event = yield event_1.default.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
                    if (!event)
                        throw new Error("event not found");
                    yield notification_1.default.create({
                        organizerId: event.organiser,
                        type: "general",
                        message: `Your event ${event.title} has been blocked by admin!`,
                        isRead: false,
                    });
                    return event;
                }
                else {
                    const event = yield event_1.default.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
                    if (!event)
                        throw new Error("event not found");
                    yield notification_1.default.create({
                        organizerId: event.organiser,
                        type: "general",
                        message: `Your event ${event.title} has been unblocked admin!`,
                        isRead: false,
                    });
                    return event;
                }
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getDashboard() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const categoryColors = {
                music: "#8B5CF6",
                sports: "#06B6D4",
                technology: "#10B981",
                Others: "#F59E0B",
                arts: "#EF4444",
            };
            const settings = yield platformSettings_1.default.findOne();
            const commissionRate = ((_a = settings === null || settings === void 0 ? void 0 : settings.adminCommissionPercentage) !== null && _a !== void 0 ? _a : 10) / 100;
            const monthlyRevenue = yield event_1.default.aggregate([
                {
                    $match: {
                        status: "completed",
                    },
                },
                {
                    $group: {
                        _id: { $month: "$date" },
                        revenue: {
                            $sum: {
                                $multiply: [
                                    { $multiply: ["$ticketPrice", "$ticketsSold"] },
                                    commissionRate,
                                ],
                            },
                        },
                        events: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        month: "$_id",
                        revenue: 1,
                        events: 1,
                        _id: 0,
                    },
                },
                {
                    $sort: { month: 1 },
                },
            ]);
            const topEvents = yield event_1.default.aggregate([
                {
                    $project: {
                        title: 1,
                        ticketsSold: 1,
                        revenue: { $multiply: ["$ticketsSold", "$ticketPrice"] },
                    },
                },
                { $sort: { revenue: -1 } },
                { $limit: 5 },
            ]);
            const eventCategories = yield event_1.default.aggregate([
                { $group: { _id: "$category", value: { $sum: 1 } } },
                { $project: { name: "$_id", value: 1, _id: 0 } },
            ]);
            const categories = eventCategories.map((cat) => (Object.assign(Object.assign({}, cat), { color: categoryColors[cat.name] || "#9CA3AF" })));
            const completedEvents = yield event_1.default.find({ status: "completed" });
            let adminEarning = 0;
            completedEvents.forEach((event) => {
                var _a, _b;
                if (event.ticketTypes && event.ticketTypes.length > 0) {
                    event.ticketTypes.forEach((t) => {
                        var _a, _b;
                        const revenue = ((_a = t.price) !== null && _a !== void 0 ? _a : 0) * ((_b = t.sold) !== null && _b !== void 0 ? _b : 0);
                        const adminCut = revenue * commissionRate;
                        adminEarning += adminCut;
                    });
                }
                else {
                    const totalTickets = (_a = event.ticketsSold) !== null && _a !== void 0 ? _a : 0;
                    const ticketPrice = (_b = event.ticketPrice) !== null && _b !== void 0 ? _b : 0;
                    const revenue = ticketPrice * totalTickets;
                    const adminCut = revenue * commissionRate;
                    adminEarning += adminCut;
                }
            });
            const activeEvents = yield event_1.default.find({
                status: "published",
                isBlocked: false,
            });
            return {
                monthlyRevenue,
                message: "Dashboard data fetched successfully",
                success: true,
                topEvents,
                eventCategories: categories,
                totalRevenue: adminEarning,
                activeEvents: activeEvents.length,
            };
        });
    }
}
exports.AdminEventRepository = AdminEventRepository;
//# sourceMappingURL=adminEventRepository.js.map