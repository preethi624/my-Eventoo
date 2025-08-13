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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const messages_1 = require("../constants/messages");
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
                const result = yield this._eventRepository.createEvent(data);
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
    getEvent(id, limit, page, searchTerm, date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._eventRepository.eventGet(id, limit, page, searchTerm, date);
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
}
exports.EventService = EventService;
//# sourceMappingURL=eventService.js.map