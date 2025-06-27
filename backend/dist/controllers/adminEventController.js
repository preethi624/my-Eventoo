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
exports.AdminEventController = void 0;
const statusCodeEnum_1 = require("../constants/statusCodeEnum");
class AdminEventController {
    constructor(adminEventService) {
        this.adminEventService = adminEventService;
    }
    ;
    getAllEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = req.query;
                const filters = {
                    searchLocation: typeof query.searchLocation === 'string' ? query.searchLocation : '',
                    searchTitle: typeof query.searchTitle === 'string' ? query.searchTitle : '',
                    orgName: typeof query.orgName === 'string' ? query.orgName : '',
                    selectedCategory: typeof query.selectedCategory === 'string' ? query.selectedCategory : '',
                    maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
                    selectedDate: typeof query.selectedDate === 'string' ? query.selectedDate : '',
                    page: query.page ? Number(query.page) : undefined,
                    limit: query.limit && !isNaN(Number(query.limit)) ? Number(query.limit) : undefined
                };
                const result = yield this.adminEventService.getEvents(filters);
                if (result.success) {
                    res.json({ result: result, message: result.message, success: true });
                }
                else {
                    res.json({ message: result.message, success: false });
                }
            }
            catch (error) {
                console.log(error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
            }
        });
    }
    eventEdit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const formData = req.body;
                const result = yield this.adminEventService.editEvent(id, formData);
                if (result.success) {
                    res.json({ success: true, message: "edited successfully" });
                    return;
                }
                else {
                    res.json({ success: false, message: "failed to edit" });
                }
            }
            catch (error) {
                console.log(error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
            }
        });
    }
    blockEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const event = req.body;
                const result = yield this.adminEventService.eventBlock(event);
                if (result.success) {
                    res.json({ success: true, message: result.message });
                }
                else {
                    res.json({ success: false, message: result.message });
                }
            }
            catch (error) {
                console.log(error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
            }
        });
    }
    getDashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminEventService.dashboardGet();
                if (response.success) {
                    res.json({ success: true, message: "successfully fetch", monthlyRevenue: response.monthlyRevenue, topEvents: response.topEvents });
                }
            }
            catch (error) {
                console.log(error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
            }
        });
    }
}
exports.AdminEventController = AdminEventController;
//# sourceMappingURL=adminEventController.js.map