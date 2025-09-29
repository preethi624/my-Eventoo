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
<<<<<<< HEAD
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const messages_1 = require("../constants/messages");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const inference_1 = require("@huggingface/inference");
const cosine_1 = require("../utils/cosine");
const axios_1 = __importDefault(require("axios"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const hf = new inference_1.InferenceClient(process.env.HUGGING_API_KEY);
=======
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const messages_1 = require("../constants/messages");
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
class EventService {
    constructor(_eventRepository) {
        this._eventRepository = _eventRepository;
    }
    eventGet(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._eventRepository.getEvents(filters);
                if (response) {
                    return {
                        response,
                        success: true,
                        message: "Event fetched successfully",
                    };
                }
                else {
                    return { success: false, message: "No events found" };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "not getting events" };
            }
        });
    }
<<<<<<< HEAD
    completedGet(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._eventRepository.getCompleted(filters);
                if (response) {
                    return {
                        response,
                        success: true,
                        message: "Event fetched successfully",
                    };
                }
                else {
                    return { success: false, message: "No events found" };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "not getting events" };
            }
        });
    }
=======
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
    eventGetById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._eventRepository.getEventById(id);
                if (result) {
                    return {
                        result,
                        success: true,
                        message: messages_1.MESSAGES.EVENT.SUCCESS_TO_FETCH,
                    };
                }
                else {
                    return { success: false, message: messages_1.MESSAGES.EVENT.FAILED_TO_FETCH };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false, message: messages_1.MESSAGES.EVENT.FAILED_TO_FETCH };
            }
        });
    }
    eventCreate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
<<<<<<< HEAD
                const text = `${data.category} ${data.description} ${data.venue}`;
                const output = yield hf.featureExtraction({
                    model: "sentence-transformers/all-MiniLM-L6-v2",
                    inputs: text,
                });
                const embedding = Array.isArray(output[0]) ? output[0] : output;
                const geoResponse = yield axios_1.default.get("https://nominatim.openstreetmap.org/search", {
                    params: {
                        q: data.venue,
                        format: "json",
                        limit: 1
                    },
                    headers: {
                        "User-Agent": "eventManagement/1.0"
                    }
                });
                if (!geoResponse.data || geoResponse.data.length === 0) {
                    return { success: false, message: "Could not geocode venue address." };
                }
                const { lat, lon } = geoResponse.data[0];
                const latitude = parseFloat(lat);
                const longitude = parseFloat(lon);
                const eventPayload = Object.assign(Object.assign({}, data), { latitude,
                    longitude,
                    embedding, location: {
                        type: "Point",
                        coordinates: [longitude, latitude]
                    } });
                const result = yield this._eventRepository.createEvent(eventPayload);
=======
                const result = yield this._eventRepository.createEvent(data);
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
                if (result) {
                    return { success: true, message: messages_1.MESSAGES.EVENT.SUCCESS_TO_CREATE };
                }
                else {
                    return { success: false, message: messages_1.MESSAGES.EVENT.FAILED_TO_CREATE };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false, message: messages_1.MESSAGES.EVENT.FAILED_TO_CREATE };
            }
        });
    }
    eventDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._eventRepository.eventDelete(id);
                if (result) {
                    return { success: true, message: messages_1.MESSAGES.EVENT.FAILED_TO_DELETE };
                }
                else {
                    return { success: false, message: messages_1.MESSAGES.EVENT.FAILED_TO_DELETE };
                }
            }
            catch (error) {
                console.log(error);
                return { success: false, message: "failed to delete event" };
            }
        });
    }
<<<<<<< HEAD
    eventEdit(id, data, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingEvent = yield this._eventRepository.findById(id);
            if (!existingEvent) {
                throw new Error("Event not found");
            }
            let normalizedImages = [];
            if (file) {
                const result = yield cloudinary_1.default.uploader.upload(file.path, {
                    folder: "events"
                });
                normalizedImages = [
                    {
                        url: result.secure_url,
                        public_id: result.public_id || null,
                    },
                ];
            }
            else {
                normalizedImages = existingEvent.images.map((img) => {
                    var _a;
                    return ({
                        url: typeof img === "string" ? img : img.url,
                        public_id: typeof img === "string" ? null : (_a = img.public_id) !== null && _a !== void 0 ? _a : null,
                    });
                });
            }
            data.images = normalizedImages;
            const updatedEvent = yield this._eventRepository.editEvent(id, data);
            return updatedEvent;
=======
    eventEdit(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._eventRepository.editEvent(id, data);
                if (result) {
                    return { success: true, message: messages_1.MESSAGES.EVENT.SUCCESS_TO_UPDATE };
                }
                else {
                    return { success: false, message: messages_1.MESSAGES.EVENT.FAILED_TO_UPDATE };
                }
            }
            catch (error) {
                console.log(error);
                return { success: false, message: "failed to edit event" };
            }
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
        });
    }
    statusCheck(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._eventRepository.statusCheck(email);
                if (result) {
                    return { result: result, success: true };
                }
                else {
                    return { success: false };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false };
            }
        });
    }
<<<<<<< HEAD
    getEvent(id, limit, page, searchTerm, date, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._eventRepository.eventGet(id, limit, page, searchTerm, date, status);
=======
    getEvent(id, limit, page, searchTerm, date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._eventRepository.eventGet(id, limit, page, searchTerm, date);
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
                if (response) {
                    return {
                        response,
                        success: true,
                        message: messages_1.MESSAGES.EVENT.SUCCESS_TO_FETCH,
                    };
                }
                else {
                    return { success: false, message: "No event found" };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "not getting event" };
            }
        });
    }
    eventCountGet(organiserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._eventRepository.getEventCount(organiserId);
                if (result) {
                    return { count: result, success: true };
                }
                else {
                    return { success: false };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false };
            }
        });
    }
    getDashboardEvents(organiserId, timeFrame) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._eventRepository.dashboardEvents(organiserId, timeFrame);
                if (response) {
                    return {
                        success: true,
                        events: response.events,
                        message: "event fetched successfully",
                        data: response.data,
                        adminPercentage: response.adminCommissionPercentage,
                        organiserEarning: response.organiserEarning,
                        totalEvents: response.totalEvents,
                        totalAttendees: response.totalAttendees,
                        topEvents: response.topEvents,
                        upcomingEvents: response.upcomingEvents,
                    };
                }
                else {
                    return { success: false, message: messages_1.MESSAGES.EVENT.FAILED_TO_FETCH };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "failed" };
            }
        });
    }
    getEvents(organiserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._eventRepository.getOrgEvents(organiserId);
                if (response) {
                    return {
                        success: true,
                        result: response,
                        message: messages_1.MESSAGES.EVENT.SUCCESS_TO_FETCH,
                    };
                }
                else {
                    return { success: false, message: "failed" };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "failed" };
            }
        });
    }
    eventFind(eventName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._eventRepository.findEvent(eventName);
                if (response) {
                    return { success: true, result: response };
                }
                else {
                    return { success: false };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false };
            }
        });
    }
    eventsFindByCat(category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._eventRepository.findEventsByCat(category);
                if (response) {
                    return { success: true, result: response };
                }
                else {
                    return { success: false };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false };
            }
        });
    }
<<<<<<< HEAD
    getRecommended(userId, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._eventRepository.findRecommended(userId, filters);
                if (response.event && response.events) {
                    const baseEmbedding = response.event.embedding;
                    if (!baseEmbedding) {
                        throw new Error("embedding not present");
                    }
                    const events = response.events;
                    const scoredEvents = events.map((event) => {
                        if (!event.embedding)
                            return Object.assign(Object.assign({}, event), { score: -1 });
                        const score = (0, cosine_1.cosineSimilarity)(baseEmbedding, event.embedding);
                        console.log("scre", score);
                        return Object.assign(Object.assign({}, event), { score });
                    });
                    console.log("scored", scoredEvents);
                    scoredEvents.sort((a, b) => b.score - a.score);
                    const filteredEvents = scoredEvents.filter(e => e.score >= 0.6);
                    return { success: true, events: filteredEvents };
                }
                if (response.events) {
                    return { success: true, events: response.events };
                }
                else {
                    return { success: false };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false };
            }
        });
    }
    nearFind(_a, filters_1) {
        return __awaiter(this, arguments, void 0, function* ({ lat, lng }, filters) {
            const response = yield this._eventRepository.findNear({ lat, lng }, filters);
            if (response) {
                return { events: response, success: true };
            }
            else {
                return { success: false };
            }
        });
    }
=======
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
}
exports.EventService = EventService;
//# sourceMappingURL=eventService.js.map