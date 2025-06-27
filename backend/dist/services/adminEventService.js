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
class AdminEventService {
    constructor(adminEventRepository) {
        this.adminEventRepository = adminEventRepository;
    }
    getEvents(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminEventRepository.getEventsAll(filters);
                if (response) {
                    return { response, success: true, message: "Users fetched successfully" };
                }
                else {
                    return { success: false, message: "failed to fetch users" };
                }
            }
            catch (error) {
                console.error('Login error:', error);
                return {
                    success: false,
                    message: 'Internal server error',
                };
            }
        });
    }
    editEvent(id, formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminEventRepository.eventEdit(id, formData);
                if (response) {
                    return { success: true, message: "Organiser edit successfully" };
                }
                else {
                    return { success: false, message: "failed to edit organiser" };
                }
            }
            catch (error) {
                console.error('Login error:', error);
                return {
                    success: false,
                    message: 'Internal server error',
                };
            }
        });
    }
    eventBlock(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminEventRepository.blockEvent(event);
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
                console.error('Login error:', error);
                return {
                    success: false,
                    message: 'Internal server error',
                };
            }
        });
    }
    dashboardGet() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminEventRepository.getDashboard();
                if (response) {
                    return { success: true, message: "fetched successfully", monthlyRevenue: response.monthlyRevenue, topEvents: response.topEvents };
                }
                else {
                    return { success: false, message: "failed to fetch" };
                }
            }
            catch (error) {
                console.error('Login error:', error);
                return {
                    success: false,
                    message: 'Internal server error',
                };
            }
        });
    }
}
exports.AdminEventService = AdminEventService;
//# sourceMappingURL=adminEventService.js.map