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
exports.EventRepository = void 0;
const event_1 = __importDefault(require("../model/event"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("../model/user"));
const baseRepository_1 = require("./baseRepository");
const platformSettings_1 = __importDefault(require("../model/platformSettings"));
class EventRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(event_1.default);
    }
    getEvents(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const { searchLocation, selectedCategory, maxPrice, selectedDate, searchTitle, page = 1, limit = 6 } = filters;
            const skip = (page - 1) * limit;
            const query = { isBlocked: false, status: "published" };
            if (searchLocation) {
                query.venue = { $regex: searchLocation, $options: 'i' };
            }
            if (searchTitle) {
                query.title = { $regex: searchTitle, $options: 'i' };
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
            const totalCount = yield event_1.default.countDocuments(query);
            const events = yield event_1.default.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
            return {
                totalPages: Math.ceil(totalCount / limit),
                events,
                currentPage: page
            };
        });
    }
    getEventById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findById(id);
        });
    }
    createEvent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("repdata", data);
            return yield event_1.default.create(data);
        });
    }
    eventDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.deleteById(id);
        });
    }
    editEvent(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedData = Object.assign(Object.assign({}, data), { date: new Date(data.date), status: data.status });
            return this.updateById(id, updatedData);
        });
    }
    statusCheck(emailObj) {
        return __awaiter(this, void 0, void 0, function* () {
            ;
            const { email } = emailObj;
            return yield user_1.default.findOne({ email });
        });
    }
    decrementAvailableTickets(eventId, ticketCount) {
        return __awaiter(this, void 0, void 0, function* () {
            yield event_1.default.findByIdAndUpdate(eventId, { $inc: { availableTickets: -ticketCount } });
        });
    }
    eventGet(id, limit, page, searchTerm, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const filter = {
                organiser: id,
            };
            if (searchTerm) {
                filter.title = { $regex: searchTerm, $options: "i" };
                filter.venue = { $regex: searchTerm, $options: "i" };
            }
            if (date) {
                const selectedDate = new Date(date);
                const nextDate = new Date(date);
                nextDate.setDate(selectedDate.getDate() + 1);
                filter.date = { $gte: selectedDate, $lt: nextDate };
            }
            const events = yield event_1.default.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 });
            const totalEvents = yield event_1.default.countDocuments({ organiser: id });
            return {
                events,
                totalPages: Math.ceil(totalEvents / limit),
                currentPage: page
            };
        });
    }
    getEventCount(organiserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield event_1.default.countDocuments({ organiser: organiserId });
        });
    }
    dashboardEvents(organiserId, timeFrame) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const days = timeFrame === '7d' ? 7 : timeFrame == '30d' ? 30 : 90;
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            const data = yield event_1.default.aggregate([
                { $match: { organiser: new mongoose_1.default.Types.ObjectId(organiserId), status: 'published', date: { $gte: startDate } } },
                {
                    $project: {
                        month: { $month: "$date" },
                        revenue: { $multiply: ["$ticketPrice", "$ticketsSold"] }
                    }
                },
                {
                    $group: {
                        _id: "$month",
                        totalRevenue: { $sum: "$revenue" },
                        totalEvents: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        month: "$_id",
                        revenue: "$totalRevenue",
                        events: "$totalEvents",
                        _id: 0
                    }
                },
                {
                    $sort: { month: 1 }
                }
            ]);
            const settings = yield platformSettings_1.default.findOne();
            const adminCommissionPercentage = (_a = settings === null || settings === void 0 ? void 0 : settings.adminCommissionPercentage) !== null && _a !== void 0 ? _a : 10;
            const adjustedData = data.map(item => ({
                month: item.month,
                events: item.events,
                revenue: item.revenue - (item.revenue * adminCommissionPercentage) / 100
            }));
            const events = yield event_1.default.find({ organiser: organiserId, date: { $gte: startDate } });
            const completedEvents = yield event_1.default.find({
                organiser: organiserId,
                status: 'completed',
                date: { $gte: startDate }
            });
            const topEvents = [...events].sort((a, b) => b.ticketsSold - a.ticketsSold).slice(0, 5);
            let organiserEarning = 0;
            completedEvents.forEach((event) => {
                const ticketRevenue = event.ticketPrice * event.ticketsSold;
                const adminCutPerTicket = (event.ticketPrice * adminCommissionPercentage) / 100;
                const totalAdminCut = adminCutPerTicket * event.ticketsSold;
                organiserEarning += ticketRevenue - totalAdminCut;
            });
            const totalEvents = events.length;
            const totalAttendees = completedEvents.reduce((sum, event) => sum + event.ticketsSold, 0);
            const upcomingEvents = events
                .filter(event => new Date(event.date) >= new Date())
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 5);
            return { events, data: adjustedData, adminCommissionPercentage, organiserEarning, totalEvents, totalAttendees, topEvents, upcomingEvents };
        });
    }
    getOrgEvents(organiserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield event_1.default.find({ organiser: organiserId });
        });
    }
    findEvent(eventName) {
        return __awaiter(this, void 0, void 0, function* () {
            const trimmedName = eventName.trim().replace(/\s+/g, '');
            const regex = new RegExp(trimmedName.split('').join('\\s*'), 'i');
            return yield event_1.default.findOne({
                title: { $regex: regex }
            });
        });
    }
    findEventsByCat(category) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield event_1.default.find({ category: { $regex: new RegExp(`^${category}$`, 'i') } });
        });
    }
}
exports.EventRepository = EventRepository;
//# sourceMappingURL=eventRepository.js.map