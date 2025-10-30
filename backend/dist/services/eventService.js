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
exports.EventService = void 0;
const messages_1 = require("../constants/messages");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const inference_1 = require("@huggingface/inference");
const cosine_1 = require("../utils/cosine");
const axios_1 = __importDefault(require("axios"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});
const hf = new inference_1.InferenceClient(process.env.HUGGING_API_KEY);
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
                // Step 1: Create the text for embedding
                const text = `${data.category} ${data.description} ${data.venue}`;
                const output = yield hf.featureExtraction({
                    model: "sentence-transformers/all-MiniLM-L6-v2",
                    inputs: text,
                });
                const embedding = Array.isArray(output[0])
                    ? output[0]
                    : output;
                // Step 2: Format the venue for geocoding
                const venueParts = [data.venue, "India"]
                    .filter(Boolean)
                    .map((p) => p.trim())
                    .filter((v, i, self) => self.indexOf(v) === i);
                const formattedVenue = venueParts.join(", ");
                console.log("formatted venue", formattedVenue);
                const geoResponse = yield axios_1.default.get("https://api.opencagedata.com/geocode/v1/json", {
                    params: {
                        q: formattedVenue,
                        key: process.env.OPENCAGE_API_KEY
                    }
                });
                console.log("Geo response:", geoResponse.data);
                // ✅ Step 4: Validate response properly
                if (!geoResponse.data ||
                    geoResponse.data.status.code !== 200 ||
                    geoResponse.data.results.length === 0) {
                    return { success: false, message: "Could not geocode venue address." };
                }
                // ✅ Step 5: Extract correct coordinates
                const locationData = geoResponse.data.results[0].geometry;
                const latitude = locationData.lat;
                const longitude = locationData.lng;
                // Step 5: Create event payload
                const eventPayload = Object.assign(Object.assign({}, data), { latitude,
                    longitude,
                    embedding, location: {
                        type: "Point",
                        coordinates: [longitude, latitude],
                    } });
                // Step 6: Save to database
                const result = yield this._eventRepository.createEvent(eventPayload);
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
    getEvent(id, limit, page, searchTerm, date, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._eventRepository.eventGet(id, limit, page, searchTerm, date, status);
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
                    const filteredEvents = scoredEvents.filter(e => e.score >= 0.2);
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
    getEventsAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._eventRepository.getAllEvents();
                return response;
            }
            catch (error) {
                console.error(error);
                return [];
            }
        });
    }
    trendingGet() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._eventRepository.getTrending();
                return response;
            }
            catch (error) {
                console.error(error);
                return [];
            }
        });
    }
    eventReschedule(date, eventId, organiserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield this._eventRepository.findOrders(eventId);
                const organiser = yield this._eventRepository.findOrg(organiserId);
                // Optional: update event date in database
                yield this._eventRepository.updateEventDate(eventId, date);
                for (const order of orders) {
                    const user = yield this._eventRepository.findUser(order.userId);
                    if (!(user === null || user === void 0 ? void 0 : user.email))
                        continue;
                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: user.email,
                        subject: `Event Rescheduled: ${order.eventTitle}`,
                        html: `
          <h3>Hello ${user.name || ""},</h3>
          <p>We wanted to let you know that the event <strong>${order.eventTitle}</strong> 
          organized by <strong>${organiser === null || organiser === void 0 ? void 0 : organiser.name}</strong> has been rescheduled.</p>
          
          <p><b>New Date:</b> ${date}</p>
          <p>We apologize for any inconvenience. Thank you for your understanding!</p>
          <br/>
          <h3>Booking Details</h3>
          <p>Event: <b>${order.eventTitle}</b></p>
          <p>Tickets: <b>${order.ticketCount}</b></p>
          <p>Order ID: ${order.orderId}</p>
          <br/>
          <p>– Event Management Team</p>
        `,
                    };
                    yield transporter.sendMail(mailOptions);
                }
                return { success: true, message: "Event rescheduled and users notified." };
            }
            catch (error) {
                console.error("Error in eventReschedule:", error);
                throw error;
            }
        });
    }
}
exports.EventService = EventService;
//# sourceMappingURL=eventService.js.map