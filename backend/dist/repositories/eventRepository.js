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
const user_1 = __importDefault(require("../model/user"));
const baseRepository_1 = require("./baseRepository");
class EventRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(event_1.default);
    }
    getEvents(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const { searchLocation, selectedCategory, maxPrice, selectedDate, searchTitle, page = 1, limit = 6 } = filters;
            const skip = (page - 1) * limit;
            const query = { isBlocked: false };
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
            const events = yield event_1.default.find(query).skip(skip).limit(limit);
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
    eventGet(id, limit, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const events = yield event_1.default.find({ organiser: id }).skip(skip).limit(limit);
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
}
exports.EventRepository = EventRepository;
//# sourceMappingURL=eventRepository.js.map