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
exports.AdminUserController = void 0;
const statusCodeEnum_1 = require("../constants/statusCodeEnum");
const mapUserToDTO_1 = require("../utils/mapUserToDTO");
const socketMap_1 = require("../socketMap");
const index_1 = require("../index");
const messages_1 = require("../constants/messages");
class AdminUserController {
    constructor(_adminUserService) {
        this._adminUserService = _adminUserService;
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limit = req.query.limit
                    ? parseInt(req.query.limit, 10)
                    : 5;
                const page = req.query.page ? parseInt(req.query.page, 10) : 1;
                const searchTerm = typeof req.query.searchTerm === "string" ? req.query.searchTerm : "";
                const filterStatus = typeof req.query.filterStatus === "string" ? req.query.filterStatus : "";
<<<<<<< HEAD
                const sortBy = typeof req.query.sortBy === "string" ? req.query.sortBy : "";
                const result = yield this._adminUserService.getUsers(limit, page, searchTerm, filterStatus, sortBy);
=======
                const result = yield this._adminUserService.getUsers(limit, page, searchTerm, filterStatus);
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
                if (result.success && result.result) {
                    const mappedUsers = result.result.map(mapUserToDTO_1.mapUserToDTO);
                    res.json({
                        result: mappedUsers,
                        message: result.message,
                        success: true,
                        total: result.total,
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
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const formData = req.body;
                const result = yield this._adminUserService.userUpdate(id, formData);
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
                res
                    .status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR)
                    .json({ message: messages_1.MESSAGES.COMMON.SERVER_ERROR });
            }
        });
    }
    blockUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.body;
                const userId = user._id;
                const result = yield this._adminUserService.userBlock(user);
                if (result.success && result.user) {
                    if (result.user.isBlocked) {
                        const socketId = socketMap_1.userSocketMap.get(userId.toString());
                        if (socketId) {
                            index_1.io.to(socketId).emit("logout");
                            console.log(`Forced logout emitted for user ${userId}`);
                        }
                    }
                    res.json({ success: true, message: "User blocked successfully" });
                }
                else {
                    res.json({ success: false, message: "failed to block" });
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
    getDashboardUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._adminUserService.dashboardUsers();
                if (result.success) {
                    res.json({
                        data: result.data,
                        message: result.message,
                        success: true,
                        totalUsers: result.totalUsers,
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
exports.AdminUserController = AdminUserController;
//# sourceMappingURL=adminUserController.js.map