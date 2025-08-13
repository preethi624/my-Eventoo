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
exports.AdminOrderController = void 0;
const statusCodeEnum_1 = require("../constants/statusCodeEnum");
const messages_1 = require("../constants/messages");
class AdminOrderController {
    constructor(_adminOrderService) {
        this._adminOrderService = _adminOrderService;
    }
    getAllOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filters = {
                    searchTerm: req.query.searchTerm,
                    statusFilter: req.query.status,
                    selectedDate: req.query.date,
                    page: req.query.page ? parseInt(req.query.page) : 1,
                    limit: req.query.limit ? parseInt(req.query.limit) : 6,
                    organiser: req.query.organiser,
                    user: req.query.user,
                };
                const result = yield this._adminOrderService.getOrders(filters);
                if (result.success) {
                    res.json({ result: result, message: result.message, success: true });
                }
                else {
                    res.json({ message: result.message, success: false });
                }
            }
            catch (error) {
                console.log(error);
                res
                    .status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR)
                    .json({ message: messages_1.MESSAGES.COMMON.SERVER_ERROR });
            }
        });
    }
    getDashboardOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { timeframe = "30d", startDate, endDate, selectedCategory, selectedMonth, selectedYear, } = req.query;
                const validTimeFrame = ["7d", "30d", "90d"].includes(timeframe)
                    ? timeframe
                    : "30d";
                const start = typeof startDate === "string" ? startDate : undefined;
                const end = typeof endDate === "string" ? endDate : undefined;
                const category = typeof selectedCategory === "string" ? selectedCategory : undefined;
                const month = typeof selectedMonth === "string" ? selectedMonth : undefined;
                const year = typeof selectedYear === "string" ? selectedYear : undefined;
                const result = yield this._adminOrderService.getDashboard(validTimeFrame, start, end, category, month, year);
                if (result.success) {
                    res.json({
                        result: result.orders,
                        message: result.message,
                        success: true,
                        salesReport: result.salesReport,
                        totalAdminEarning: result.totalAdminEarning,
                    });
                }
                else {
                    res.json({ message: result.message, success: false });
                }
            }
            catch (error) {
                console.log(error);
                res
                    .status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR)
                    .json({ message: messages_1.MESSAGES.COMMON.SERVER_ERROR });
            }
        });
    }
}
exports.AdminOrderController = AdminOrderController;
//# sourceMappingURL=adminOrderController.js.map