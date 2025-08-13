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
exports.OrganiserService = void 0;
const messages_1 = require("../constants/messages");
class OrganiserService {
    constructor(_organiserRepository) {
        this._organiserRepository = _organiserRepository;
    }
    orgGetById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._organiserRepository.getOrganiserById(id);
                if (result) {
                    return {
                        result,
                        success: true,
                        message: "organiser fetched successfully",
                    };
                }
                else {
                    return { success: false, message: "No organiser found" };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "not getting event" };
            }
        });
    }
    statusCheck(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._organiserRepository.statusCheck(email);
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
    organiserUpdate(data, organiserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._organiserRepository.updateOrganiser(data, organiserId);
                if (result) {
                    return {
                        result: result,
                        success: true,
                        message: "user updated successfully",
                    };
                }
                else {
                    return { success: false, message: "failed to update" };
                }
            }
            catch (error) {
                console.log(error);
                return { success: false, message: "failed to update" };
            }
        });
    }
    bookingFetch(organiserId, limit, page, searchTerm, status, date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._organiserRepository.fetchBooking(organiserId, limit, page, searchTerm, status, date);
                if (result) {
                    return {
                        success: true,
                        message: "orders fetched successfully",
                        result: result.result,
                        totalPages: result.totalPages,
                        currentPage: result.currentPage,
                    };
                }
                else {
                    return { success: false, message: "failed to fetch" };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "failed to fetch orders" };
            }
        });
    }
    orderGetDetails(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._organiserRepository.getOrderDetails(orderId);
                console.log("fetch result", result);
                if (result) {
                    return {
                        success: true,
                        message: "orders fetched successfully",
                        order: result,
                    };
                }
                else {
                    return { success: false, message: "failed to fetch" };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "failed to fetch orders" };
            }
        });
    }
    reapplyOrg(organiserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._organiserRepository.orgReapply(organiserId);
                console.log("fetch result", result);
                if (result) {
                    return { success: true, message: "reapplied successfully" };
                }
                else {
                    return { success: false, message: "failed to reapply" };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "failed to reapply" };
            }
        });
    }
    venuesGet(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._organiserRepository.getVenues(filters);
                if (result) {
                    return {
                        success: true,
                        message: "venues fetched successfully",
                        venues: result.venues,
                        totalPages: result.totalPages,
                        currentPage: result.currentPage,
                    };
                }
                else {
                    return { success: false, message: "failed to fetch" };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "failed to fetch orders" };
            }
        });
    }
    venueGetById(venueId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._organiserRepository.getVenueById(venueId);
                if (result) {
                    return {
                        success: true,
                        message: "orders fetched successfully",
                        venue: result,
                    };
                }
                else {
                    return { success: false, message: "failed to fetch" };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "failed to fetch venue" };
            }
        });
    }
    dashboardGet(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._organiserRepository.getDashboard(eventId);
                if (result) {
                    return {
                        success: true,
                        message: "orders fetched successfully",
                        data: result,
                    };
                }
                else {
                    return { success: false, message: "failed to fetch" };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "failed to fetch venue" };
            }
        });
    }
    attendeesFetch(eventId, organiserId, filters, filterStatus, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._organiserRepository.fetchAttendees(eventId, organiserId, filters, filterStatus, page, limit);
                if (response) {
                    return {
                        success: true,
                        message: "fetched successfully",
                        attendees: response.attendees,
                        revenue: response.revenue,
                        currentPage: response.currentPage,
                        totalPages: response.totalPages,
                        totalAttendees: response.totalAttendees,
                    };
                }
                else {
                    return { success: false, message: "failed" };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false, message: messages_1.MESSAGES.EVENT.FAILED_TO_FETCH };
            }
        });
    }
    getDashboardEvents(organiserId, timeFrame, startDate, endDate, category, month, year) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("serviceStart", startDate);
                const response = yield this._organiserRepository.dashboardEvents(organiserId, timeFrame, startDate, endDate, category, month, year);
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
                        orderDetails: response.orderDetails,
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
    ticketUpdate(qrToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._organiserRepository.updateTicket(qrToken);
                return { message: response.message };
            }
            catch (error) {
                console.log(error);
                return { message: messages_1.MESSAGES.EVENT.FAILED_TO_UPDATE };
            }
        });
    }
    usersGet() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._organiserRepository.getUsers();
                if (response) {
                    return { users: response, success: true };
                }
                else {
                    return { success: false };
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
}
exports.OrganiserService = OrganiserService;
//# sourceMappingURL=organiserService.js.map