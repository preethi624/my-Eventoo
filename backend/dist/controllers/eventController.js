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
exports.EventController = void 0;
const statusCodeEnum_1 = require("../constants/statusCodeEnum");
class EventController {
    constructor(eventService) {
        this.eventService = eventService;
    }
    getEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = req.query;
                const filters = {
                    searchLocation: typeof query.searchLocation === 'string' ? query.searchLocation : '',
                    searchTitle: typeof query.searchTitle === 'string' ? query.searchTitle : '',
                    selectedCategory: typeof query.selectedCategory === 'string' ? query.selectedCategory : '',
                    maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
                    selectedDate: typeof query.selectedDate === 'string' ? query.selectedDate : '',
                    page: query.page ? Number(query.page) : undefined,
                    limit: query.limit ? Number(query.limit) : undefined
                };
                const result = yield this.eventService.eventGet(filters);
                if (result) {
                    res.json({ result: result, success: true });
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
                    message: "Failed to fetch events",
                });
            }
        });
    }
    ;
    getEventById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const response = yield this.eventService.eventGetById(id);
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
                    message: "Failed to fetch events",
                });
            }
        });
    }
    ;
    createEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const files = req.files;
                const eventData = Object.assign(Object.assign({}, req.body), { images: (files === null || files === void 0 ? void 0 : files.map((file) => file.path)) || [] });
                const response = yield this.eventService.eventCreate(eventData);
                if (response.success) {
                    res.json({ success: true, message: "Event created successfully" });
                }
                else {
                    res.json({ success: false, message: "Failed to create event" });
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
    deleteEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                console.log("id", id);
                const response = yield this.eventService.eventDelete(id);
                if (response.success) {
                    res.json({ success: true, messge: "event deleted" });
                }
                else {
                    res.json({ success: false, message: "failed to delete event" });
                }
            }
            catch (error) {
                console.error(error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Failed to delete event",
                });
            }
        });
    }
    editEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("req", req.body);
                const data = req.body;
                const id = req.params.id;
                const response = yield this.eventService.eventEdit(id, data);
                if (response.success) {
                    res.json({ success: true, message: "Event edited successfully" });
                }
                else {
                    res.json({ success: false, message: "Failed to edit event" });
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
    checkStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = req.body;
                const response = yield this.eventService.statusCheck(result);
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
    eventGet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const limit = req.query.limit ? parseInt(req.query.limit, 10) : 5;
                const page = req.query.page ? parseInt(req.query.page, 10) : 1;
                const searchTerm = req.query.searchTerm;
                const date = req.query.date;
                const response = yield this.eventService.getEvent(id, limit, page, searchTerm, date);
                console.log("response", response);
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
                    message: "Failed to fetch events",
                });
            }
        });
    }
    ;
    getEventCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const organiserId = req.params.organiserId;
                const response = yield this.eventService.eventCountGet(organiserId);
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
                    message: "Failed to fetch events",
                });
            }
        });
    }
    ;
    getDashboardEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const organiserId = req.params.organiserId || '';
                const timeFrame = req.query.timeFrame || '30d';
                const response = yield this.eventService.getDashboardEvents(organiserId, timeFrame);
                if (response.success) {
                    res.json({ success: true, events: response.events, data: response.data, adminPercentage: response.adminPercentage, organiserEarning: response.organiserEarning, totalEvents: response.totalEvents, totalAttendees: response.totalAttendees, topEvents: response.topEvents, upcomingEvents: response.upcomingEvents });
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
                    message: "Failed to fetch events",
                });
            }
        });
    }
    getOrgEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const organiserId = req.params.orgId || '';
                const response = yield this.eventService.getEvents(organiserId);
                if (response) {
                    res.json({ events: response.result, success: true });
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
                    message: "Failed to fetch events",
                });
            }
        });
    }
}
exports.EventController = EventController;
//# sourceMappingURL=eventController.js.map