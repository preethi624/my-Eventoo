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
class AdminUserController {
    constructor(adminUserService) {
        this.adminUserService = adminUserService;
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminUserService.getUsers();
                if (result.success && result.result) {
                    const mappedUsers = result.result.map(mapUserToDTO_1.mapUserToDTO);
                    res.json({ result: mappedUsers, message: result.message, success: true });
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
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const formData = req.body;
                const result = yield this.adminUserService.userUpdate(id, formData);
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
    blockUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.body;
                const userId = user._id;
                const result = yield this.adminUserService.userBlock(user);
                if (result.success && result.user) {
                    if (result.user.isBlocked) {
                        const socketId = socketMap_1.userSocketMap.get(userId.toString());
                        if (socketId) {
                            index_1.io.to(socketId).emit('logout');
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
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
            }
        });
    }
}
exports.AdminUserController = AdminUserController;
//# sourceMappingURL=adminUserController.js.map