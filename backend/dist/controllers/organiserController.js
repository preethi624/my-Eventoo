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
class OrganiserController {
    constructor(organiserService) {
        this.organiserService = organiserService;
    }
    getOrgById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const response = yield this.organiserService.orgGetById(id);
                if (response) {
                    res.json({ result: response, success: true });
                }
                else {
                    res.status(statusCodeEnum_1.StatusCode.NOT_FOUND).json({
                        success: false,
                        message: "No events found",
                    });
                }
            }
            catch (error) {
                console.error(error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Failed to fetch organiser",
                });
            }
        });
    }
    checkStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = req.body;
                const response = yield this.organiserService.statusCheck(result);
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
                    message: "Failed to create event",
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
                const response = yield this.organiserService.organiserUpdate(data, organiserId);
                if (response.success) {
                    res.json({ result: response.result, success: true, message: "organiser updated " });
                }
                else {
                    res.json({ success: false, message: "failed to update" });
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
                const limit = req.query.limit ? parseInt(req.query.limit, 10) : 5;
                const page = req.query.page ? parseInt(req.query.page, 10) : 1;
                const searchTerm = req.query.searchTerm;
                const status = req.query.status;
                const date = req.query.date;
                console.log("date", date);
                const response = yield this.organiserService.bookingFetch(organiserId, limit, page, searchTerm, status, date);
                if (response.success) {
                    res.json({ message: response.message, success: true, result: response.result, totalPages: response.totalPages, currentPage: response.currentPage });
                }
                else {
                    res.json({ message: "failed to fetch orders", success: false });
                }
            }
            catch (error) {
                console.error("Error in payment verification :", error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    }
    getOrderDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderId = req.params.orderId;
                console.log("contr orderid", orderId);
                const response = yield this.organiserService.orderGetDetails(orderId);
                if (response.success) {
                    res.json({ message: response.message, success: true, order: response.order });
                }
                else {
                    res.json({ message: "failed to fetch orders", success: false });
                }
            }
            catch (error) {
                console.error("Error in payment verification :", error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    }
    orgReapply(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const organiserId = req.params.orgId;
                const response = yield this.organiserService.reapplyOrg(organiserId);
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
                    message: "Internal server error",
                });
            }
        });
    }
    getVenues(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = req.query;
                const filters = {
                    nameSearch: typeof query.nameSearch === 'string' ? query.nameSearch : '',
                    locationSearch: typeof query.locationSearch === 'string' ? query.locationSearch : '',
                    page: query.page ? Number(query.page) : undefined,
                    limit: query.limit && !isNaN(Number(query.limit)) ? Number(query.limit) : undefined
                };
                const response = yield this.organiserService.venuesGet(filters);
                if (response.success) {
                    res.json({ message: response.message, success: true, venues: response.venues, totalPages: response.totalPages, currentPage: response.currentPage });
                }
                else {
                    res.json({ message: "failed to fetch venues", success: false });
                }
            }
            catch (error) {
                console.error("Error in payment verification :", error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    }
    getVenueById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const venueId = req.params.venueId;
                const response = yield this.organiserService.venueGetById(venueId);
                if (response.success) {
                    res.json({ message: response.message, success: true, venue: response.venue });
                }
                else {
                    res.json({ message: "failed to fetch orders", success: false });
                }
            }
            catch (error) {
                console.error("Error in payment verification :", error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    }
    getDashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const eventId = req.params.eventId;
                const response = yield this.organiserService.dashboardGet(eventId);
                if (response.success) {
                    res.json({ message: response.message, success: true, data: response.data });
                }
                else {
                    res.json({ message: "failed to fetch orders", success: false });
                }
            }
            catch (error) {
                console.error("Error in payment verification :", error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    }
    fetchAttendees(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const eventId = req.params.eventId;
                const organiserId = req.params.organiserId;
                const searchTerm = typeof req.query.searchTerm === 'string' ? req.query.searchTerm : '';
                const filterStatus = typeof req.query.filterStatus === 'string' ? req.query.filterStatus : '';
                const response = yield this.organiserService.attendeesFetch(eventId, organiserId, searchTerm, filterStatus);
                if (response.success) {
                    res.json({ success: true, message: "fetched succeessfully", attendee: response.attendees, revenue: response.revenue });
                }
                else {
                    res.json({ success: false, message: "failed" });
                }
            }
            catch (error) {
                console.error("Error in payment verification :", error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    }
}
exports.OrganiserController = OrganiserController;
//# sourceMappingURL=organiserController.js.map