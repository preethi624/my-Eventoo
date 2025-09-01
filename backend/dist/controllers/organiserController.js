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
exports.OrganiserController = void 0;
const statusCodeEnum_1 = require("../constants/statusCodeEnum");
const messages_1 = require("../constants/messages");
class OrganiserController {
    constructor(_organiserService) {
        this._organiserService = _organiserService;
    }
    getOrgById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const response = yield this._organiserService.orgGetById(id);
                if (response) {
                    res.json({ result: response, success: true });
                }
                else {
                    res.status(statusCodeEnum_1.StatusCode.NOT_FOUND).json({
                        success: false,
                        message: messages_1.MESSAGES.COMMON.NOT_FOUND,
                    });
                }
            }
            catch (error) {
                console.error(error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.MESSAGES.EVENT.FAILED_TO_FETCH,
                });
            }
        });
    }
    checkStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = req.body;
                const response = yield this._organiserService.statusCheck(result);
                if (response) {
                    res.json({ user: response, success: true });
                }
                else {
                    res.json({ success: false });
                }
            }
            catch (error) {
                console.error(error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.MESSAGES.EVENT.FAILED_TO_CREATE,
                });
            }
        });
    }
    updateOrganiser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { name, email, phone, location, aboutMe } = req.body;
                const organiserId = req.params.organiserId;
                const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
                const data = {
                    name,
                    email,
                    phone,
                    location,
                    aboutMe,
                    profileImage: image,
                };
                const response = yield this._organiserService.organiserUpdate(data, organiserId);
                if (response.success) {
                    res.json({
                        result: response.result,
                        success: true,
                        message: "organiser updated ",
                    });
                }
                else {
                    res.json({ success: false, message: messages_1.MESSAGES.EVENT.FAILED_TO_UPDATE });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    fetchBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const organiserId = req.params.organiserId;
                const limit = req.query.limit
                    ? parseInt(req.query.limit, 10)
                    : 5;
                const page = req.query.page ? parseInt(req.query.page, 10) : 1;
                const searchTerm = req.query.searchTerm;
                const status = req.query.status;
                const date = req.query.date;
                const response = yield this._organiserService.bookingFetch(organiserId, limit, page, searchTerm, status, date);
                if (response.success) {
                    res.json({
                        message: response.message,
                        success: true,
                        result: response.result,
                        totalPages: response.totalPages,
                        currentPage: response.currentPage,
                    });
                }
                else {
                    res.json({ message: messages_1.MESSAGES.EVENT.FAILED_TO_FETCH, success: false });
                }
            }
            catch (error) {
                console.error("Error in payment verification :", error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.MESSAGES.COMMON.SERVER_ERROR,
                });
            }
        });
    }
    getOrderDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderId = req.params.orderId;
                console.log("contr orderid", orderId);
                const response = yield this._organiserService.orderGetDetails(orderId);
                if (response.success) {
                    res.json({
                        message: response.message,
                        success: true,
                        order: response.order,
                    });
                }
                else {
                    res.json({ message: messages_1.MESSAGES.EVENT.FAILED_TO_FETCH, success: false });
                }
            }
            catch (error) {
                console.error("Error in payment verification :", error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.MESSAGES.COMMON.SERVER_ERROR,
                });
            }
        });
    }
    orgReapply(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const organiserId = req.params.orgId;
                const response = yield this._organiserService.reapplyOrg(organiserId);
                if (response.success) {
                    res.json({ success: true, message: response.message });
                }
                else {
                    res.json({ success: false, message: response.message });
                }
            }
            catch (error) {
                console.error("Error in payment verification :", error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.MESSAGES.COMMON.SERVER_ERROR,
                });
            }
        });
    }
    getVenues(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = req.query;
                const filters = {
                    searchTerm: typeof query.searchTerm === "string" ? query.searchTerm : "",
                    page: query.page ? Number(query.page) : undefined,
                    limit: query.limit && !isNaN(Number(query.limit))
                        ? Number(query.limit)
                        : undefined,
                };
                const response = yield this._organiserService.venuesGet(filters);
                if (response.success) {
                    res.json({
                        message: response.message,
                        success: true,
                        venues: response.venues,
                        totalPages: response.totalPages,
                        currentPage: response.currentPage,
                    });
                }
                else {
                    res.json({ message: "failed to fetch venues", success: false });
                }
            }
            catch (error) {
                console.error("Error in payment verification :", error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.MESSAGES.COMMON.SERVER_ERROR,
                });
            }
        });
    }
    getVenueById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const venueId = req.params.venueId;
                const response = yield this._organiserService.venueGetById(venueId);
                if (response.success) {
                    res.json({
                        message: response.message,
                        success: true,
                        venue: response.venue,
                    });
                }
                else {
                    res.json({ message: "failed to fetch orders", success: false });
                }
            }
            catch (error) {
                console.error("Error in payment verification :", error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.MESSAGES.COMMON.SERVER_ERROR,
                });
            }
        });
    }
    getDashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const eventId = req.params.eventId;
                const response = yield this._organiserService.dashboardGet(eventId);
                if (response.success) {
                    res.json({
                        message: response.message,
                        success: true,
                        data: response.data,
                    });
                }
                else {
                    res.json({ message: messages_1.MESSAGES.EVENT.FAILED_TO_FETCH, success: false });
                }
            }
            catch (error) {
                console.error("Error in payment verification :", error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.MESSAGES.COMMON.SERVER_ERROR,
                });
            }
        });
    }
    fetchAttendees(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const eventId = req.params.eventId;
                const organiserId = req.params.organiserId;
                const searchTerm = typeof req.query.searchTerm === "string" ? req.query.searchTerm : "";
                const filterStatus = typeof req.query.filterStatus === "string"
                    ? req.query.filterStatus
                    : "";
                const page = req.query.currentPage
                    ? parseInt(req.query.currentPage, 10)
                    : 1;
                const limit = req.query.limit
                    ? parseInt(req.query.limit, 10)
                    : 6;
                const response = yield this._organiserService.attendeesFetch(eventId, organiserId, searchTerm, filterStatus, page, limit);
                if (response.success) {
                    res.json({
                        success: true,
                        message: messages_1.MESSAGES.EVENT.SUCCESS_TO_FETCH,
                        attendee: response.attendees,
                        revenue: response.revenue,
                        currentPage: response.currentPage,
                        totalPages: response.totalPages,
                        totalAttendees: response.totalAttendees,
                    });
                }
                else {
                    res.json({ success: false, message: messages_1.MESSAGES.EVENT.FAILED_TO_FETCH });
                }
            }
            catch (error) {
                console.error("Error in payment verification :", error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.MESSAGES.COMMON.SERVER_ERROR,
                });
            }
        });
    }
    getDashboardEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const organiserId = req.params.organiserId || "";
                const { timeframe = "30d", startDate, endDate, selectedCategory, selectedMonth, selectedYear, } = req.query;
                const validTimeFrame = ["7d", "30d", "90d"].includes(timeframe)
                    ? timeframe
                    : "30d";
                const start = typeof startDate === "string" ? startDate : undefined;
                const end = typeof endDate === "string" ? endDate : undefined;
                const category = typeof selectedCategory === "string" ? selectedCategory : undefined;
                const month = typeof selectedMonth === "string" ? selectedMonth : undefined;
                const year = typeof selectedYear === "string" ? selectedYear : undefined;
                const response = yield this._organiserService.getDashboardEvents(organiserId, validTimeFrame, start, end, category, month, year);
                if (response.success) {
                    res.json({
                        success: true,
                        events: response.events,
                        data: response.data,
                        adminPercentage: response.adminPercentage,
                        organiserEarning: response.organiserEarning,
                        totalEvents: response.totalEvents,
                        totalAttendees: response.totalAttendees,
                        topEvents: response.topEvents,
                        upcomingEvents: response.upcomingEvents,
                        orderDetails: response.orderDetails,
                    });
                }
                else {
                    res.status(statusCodeEnum_1.StatusCode.NOT_FOUND).json({
                        success: false,
                        message: messages_1.MESSAGES.COMMON.NOT_FOUND,
                    });
                }
            }
            catch (error) {
                console.error(error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.MESSAGES.EVENT.FAILED_TO_FETCH,
                });
            }
        });
    }
    updateTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { qrToken } = req.body;
                const response = yield this._organiserService.ticketUpdate(qrToken);
                res.json({ message: response.message });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._organiserService.usersGet();
                if (response.success) {
                    res.json({ response });
                }
                else {
                    res.json({ success: false });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    fetchEventOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const eventId = req.params.eventId;
                const response = yield this._organiserService.eventOrders(eventId);
                if (response.success) {
                    res.json({ success: true, orders: response.orders });
                }
                else {
                    res.json({ success: false });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    cancelOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderId = req.params.orderId;
            try {
                const response = yield this._organiserService.orderCancel(orderId);
                if (response) {
                    res.json({ response });
                }
            }
            catch (error) {
                console.error("Error in payment verification :", error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.MESSAGES.COMMON.SERVER_ERROR,
                });
            }
        });
    }
    fetchVenues(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._organiserService.venuesFetch();
                if (response.success) {
                    res.json({
                        success: true, venues: response.venues
                    });
                }
                else {
                    res.json({ success: false });
                }
            }
            catch (error) {
                console.error("Error in payment verification :", error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.MESSAGES.COMMON.SERVER_ERROR,
                });
            }
        });
    }
}
exports.OrganiserController = OrganiserController;
//# sourceMappingURL=organiserController.js.map