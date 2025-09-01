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
const messages_1 = require("../constants/messages");
class EventController {
    constructor(_eventService) {
        this._eventService = _eventService;
    }
    getEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = req.query;
                const filters = {
                    searchTerm: typeof query.searchTerm === "string" ? query.searchTerm : "",
                    selectedCategory: typeof query.selectedCategory === "string"
                        ? query.selectedCategory
                        : "",
                    maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
                    selectedDate: typeof query.selectedDate === "string" ? query.selectedDate : "",
                    page: query.page ? Number(query.page) : undefined,
                    limit: query.limit ? Number(query.limit) : undefined,
                };
                const result = yield this._eventService.eventGet(filters);
                if (result) {
                    res.json({ result: result, success: true });
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
    getCompleted(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = req.query;
                const filters = {
                    searchTerm: typeof query.searchTerm === "string" ? query.searchTerm : "",
                    selectedCategory: typeof query.selectedCategory === "string"
                        ? query.selectedCategory
                        : "",
                    maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
                    selectedDate: typeof query.selectedDate === "string" ? query.selectedDate : "",
                    page: query.page ? Number(query.page) : undefined,
                    limit: query.limit ? Number(query.limit) : undefined,
                };
                const result = yield this._eventService.completedGet(filters);
                if (result) {
                    res.json({ result: result, success: true });
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
    getEventById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const response = yield this._eventService.eventGetById(id);
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
    createEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const files = req.files;
                console.log("from cloud", files);
                const eventData = Object.assign(Object.assign({}, req.body), { images: (files === null || files === void 0 ? void 0 : files.map((file) => ({
                        url: file.path,
                        public_id: file.filename
                    }))) || [] });
                const response = yield this._eventService.eventCreate(eventData);
                if (response.success) {
                    res.json({ success: true, message: messages_1.MESSAGES.EVENT.SUCCESS_TO_CREATE });
                }
                else {
                    res.json({ success: false, message: messages_1.MESSAGES.EVENT.FAILED_TO_CREATE });
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
    deleteEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                console.log("id", id);
                const response = yield this._eventService.eventDelete(id);
                if (response.success) {
                    res.json({ success: true, messge: messages_1.MESSAGES.EVENT.SUCCESS_TO_DELETE });
                }
                else {
                    res.json({ success: false, message: messages_1.MESSAGES.EVENT.FAILED_TO_DELETE });
                }
            }
            catch (error) {
                console.error(error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.MESSAGES.EVENT.FAILED_TO_DELETE,
                });
            }
        });
    }
    editEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const file = req.file;
                const data = req.body;
                const id = req.params.id;
                const response = yield this._eventService.eventEdit(id, data, file);
                if (response) {
                    res.json({ success: true, message: messages_1.MESSAGES.EVENT.SUCCESS_TO_UPDATE });
                }
                else {
                    res.json({ success: false, message: messages_1.MESSAGES.EVENT.FAILED_TO_UPDATE });
                }
            }
            catch (error) {
                console.error(error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.MESSAGES.EVENT.FAILED_TO_UPDATE,
                });
            }
        });
    }
    checkStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = req.body;
                const response = yield this._eventService.statusCheck(result);
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
    eventGet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const limit = req.query.limit
                    ? parseInt(req.query.limit, 10)
                    : 5;
                const page = req.query.page ? parseInt(req.query.page, 10) : 1;
                const searchTerm = req.query.searchTerm;
                const date = req.query.date;
                const status = req.query.status;
                const response = yield this._eventService.getEvent(id, limit, page, searchTerm, date, status);
                console.log("response", response);
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
    getEventCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const organiserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!organiserId) {
                    throw new Error("organiserId not get");
                }
                const response = yield this._eventService.eventCountGet(organiserId);
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
    getDashboardEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const organiserId = req.params.organiserId || "";
                const timeFrame = req.query.timeFrame || "30d";
                const response = yield this._eventService.getDashboardEvents(organiserId, timeFrame);
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
    getOrgEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const organiserId = req.params.orgId || "";
                const response = yield this._eventService.getEvents(organiserId);
                if (response) {
                    res.json({ events: response.result, success: true });
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
    findEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const eventName = req.query.name;
            try {
                const response = yield this._eventService.eventFind(eventName);
                if (response.success) {
                    res.json({ result: response.result });
                }
                else {
                    res.json({ success: false });
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
    findEventsByCat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = req.query.name;
            try {
                const response = yield this._eventService.eventsFindByCat(category);
                if (response.success) {
                    res.json({ result: response.result });
                }
                else {
                    res.json({ success: false });
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
    findRecommended(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const query = req.query;
            const filters = {
                searchTerm: typeof query.searchTerm === "string" ? query.searchTerm : "",
                maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
                selectedDate: typeof query.selectedDate === "string" ? query.selectedDate : "",
                page: query.page ? Number(query.page) : undefined,
                limit: query.limit ? Number(query.limit) : undefined,
            };
            try {
                if (!userId)
                    throw new Error("userId not get");
                const response = yield this._eventService.getRecommended(userId, filters);
                if (response.success) {
                    res.json({ success: true, events: response.events });
                }
                else {
                    res.json({ success: false });
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
    findNear(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lat = Number(req.query.lat);
                const lng = Number(req.query.lng);
                const query = req.query;
                const filters = {
                    searchTerm: typeof query.searchTerm === "string" ? query.searchTerm : "",
                    maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
                    selectedDate: typeof query.selectedDate === "string" ? query.selectedDate : "",
                    page: query.page ? Number(query.page) : undefined,
                    limit: query.limit ? Number(query.limit) : undefined,
                };
                const response = yield this._eventService.nearFind({ lat, lng }, filters);
                if (response) {
                    res.json({ data: response.events, success: true });
                }
                else {
                    res.json({ success: false });
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
}
exports.EventController = EventController;
//# sourceMappingURL=eventController.js.map