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
class AdminOrderController {
    constructor(adminOrderService) {
        this.adminOrderService = adminOrderService;
    }
    ;
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
                    user: req.query.user
                };
                const result = yield this.adminOrderService.getOrders(filters);
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
}
exports.AdminOrderController = AdminOrderController;
//# sourceMappingURL=adminOrderController.js.map