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
class EventService {
    constructor(eventRepository) {
        this.eventRepository = eventRepository;
    }
    eventGet(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.eventRepository.getEvents(filters);
                if (response) {
                    return { response, success: true, message: "Event fetched successfully" };
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
                const result = yield this.eventRepository.getEventById(id);
                if (result) {
                    return { result, success: true, message: "Event fetched successfully" };
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
    ;
    eventCreate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.eventRepository.createEvent(data);
                if (result) {
                    return { success: true, message: "Event created successfully" };
                }
                else {
                    return { success: false, message: "Failed t create event" };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "not creating event" };
            }
        });
    }
    eventDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.eventRepository.eventDelete(id);
                if (result) {
                    return { success: true, message: "event deleted successfully" };
                }
                else {
                    return { success: false, message: "event not deleted" };
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
                const result = yield this.eventRepository.editEvent(id, data);
                if (result) {
                    return { success: true, message: "event edited successfully" };
                }
                else {
                    return { success: false, message: "faled to edit" };
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
                const result = yield this.eventRepository.statusCheck(email);
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
                const response = yield this.eventRepository.eventGet(id, limit, page, searchTerm, date);
                if (response) {
                    return { response, success: true, message: "Event fetched successfully" };
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
    ;
    eventCountGet(organiserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.eventRepository.getEventCount(organiserId);
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
    ;
    getDashboardEvents(organiserId, timeFrame) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.eventRepository.dashboardEvents(organiserId, timeFrame);
                if (response) {
                    return { success: true, events: response.events, message: "event fetched successfully", data: response.data, adminPercentage: response.adminCommissionPercentage, organiserEarning: response.organiserEarning, totalEvents: response.totalEvents, totalAttendees: response.totalAttendees, topEvents: response.topEvents, upcomingEvents: response.upcomingEvents };
                }
                else {
                    return { success: false, message: "failed to fetch events" };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "failed" };
            }
        });
    }
}
exports.EventService = EventService;
//# sourceMappingURL=eventService.js.map