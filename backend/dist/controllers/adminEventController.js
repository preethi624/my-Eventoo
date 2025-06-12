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
                const result = yield this.adminEventService.getEvents();
                if (result.success) {
                    res.json({ result: result.result, message: result.message, success: true });
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
}
exports.AdminEventController = AdminEventController;
//# sourceMappingURL=adminEventController.js.map