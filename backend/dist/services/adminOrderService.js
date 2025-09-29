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
exports.AdminOrderService = void 0;
const messages_1 = require("../constants/messages");
class AdminOrderService {
    constructor(_adminOrderRepository) {
        this._adminOrderRepository = _adminOrderRepository;
    }
    getOrders(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._adminOrderRepository.getOrdersAll(filters);
                if (response) {
                    return {
                        result: response,
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
    getDashboard(timeFrame, startDate, endDate, category, month, year) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._adminOrderRepository.getDashboardOrders(timeFrame, startDate, endDate, category, month, year);
                if (response) {
                    return {
                        orders: response.orders,
                        success: true,
                        message: "Users fetched successfully",
                        salesReport: response.salesReport,
                        totalAdminEarning: response.totalAdminEarning,
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
<<<<<<< HEAD
    orderDetailsGet(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._adminOrderRepository.getOrderDetails(orderId);
                if (response) {
                    return { success: true, orders: response };
                }
                else {
                    return { success: false };
                }
            }
            catch (error) {
                console.log(error);
                return { success: false };
            }
        });
    }
=======
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
}
exports.AdminOrderService = AdminOrderService;
//# sourceMappingURL=adminOrderService.js.map