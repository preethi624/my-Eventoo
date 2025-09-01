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
exports.AdminEventService = void 0;
const messages_1 = require("../constants/messages");
class AdminEventService {
    constructor(_adminEventRepository) {
        this._adminEventRepository = _adminEventRepository;
    }
    getEvents(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("fil", filters);
                const response = yield this._adminEventRepository.getEventsAll(filters);
                if (response) {
                    return {
                        response,
                        success: true,
                        message: messages_1.MESSAGES.EVENT.SUCCESS_TO_FETCH,
                    };
                }
                else {
                    return { success: false, message: messages_1.MESSAGES.EVENT.FAILED_TO_FETCH };
                }
            }
            catch (error) {
                console.error("Login error:", error);
                return {
                    success: false,
                    message: messages_1.MESSAGES.COMMON.SERVER_ERROR,
                };
            }
        });
    }
    editEvent(id, formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._adminEventRepository.eventEdit(id, formData);
                if (response) {
                    return { success: true, message: messages_1.MESSAGES.EVENT.SUCCESS_TO_UPDATE };
                }
                else {
                    return { success: false, message: messages_1.MESSAGES.EVENT.FAILED_TO_UPDATE };
                }
            }
            catch (error) {
                console.error("Login error:", error);
                return {
                    success: false,
                    message: messages_1.MESSAGES.COMMON.SERVER_ERROR,
                };
            }
        });
    }
    eventBlock(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._adminEventRepository.blockEvent(event);
                if (response) {
                    if (response.isBlocked) {
                        return { success: true, message: "Event blocked successfully" };
                    }
                    else {
                        return { success: true, message: "Event unblocked successfully" };
                    }
                }
                else {
                    return { success: false, message: "failed to block" };
                }
            }
            catch (error) {
                console.error("Login error:", error);
                return {
                    success: false,
                    message: messages_1.MESSAGES.COMMON.SERVER_ERROR,
                };
            }
        });
    }
    dashboardGet() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._adminEventRepository.getDashboard();
                if (response) {
                    return {
                        success: true,
                        message: "fetched successfully",
                        monthlyRevenue: response.monthlyRevenue,
                        topEvents: response.topEvents,
                        eventCategories: response.eventCategories,
                        totalRevenue: response.totalRevenue,
                        activeEvents: response.activeEvents,
                    };
                }
                else {
                    return { success: false, message: messages_1.MESSAGES.EVENT.FAILED_TO_FETCH };
                }
            }
            catch (error) {
                console.error("Login error:", error);
                return {
                    success: false,
                    message: messages_1.MESSAGES.COMMON.SERVER_ERROR,
                };
            }
        });
    }
}
exports.AdminEventService = AdminEventService;
//# sourceMappingURL=adminEventService.js.map