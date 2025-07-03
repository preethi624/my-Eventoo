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
class AdminOrderService {
    constructor(adminOrderRepository) {
        this.adminOrderRepository = adminOrderRepository;
    }
    ;
    getOrders(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminOrderRepository.getOrdersAll(filters);
                if (response) {
                    return { result: response, success: true, message: "Users fetched successfully" };
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
    getDashboard() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminOrderRepository.getDashboardOrders();
                if (response) {
                    return { recentTransactions: response.recentTransactions, success: true, message: "Users fetched successfully" };
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
}
exports.AdminOrderService = AdminOrderService;
//# sourceMappingURL=adminOrderService.js.map