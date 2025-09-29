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
exports.AdminUserService = void 0;
const messages_1 = require("../constants/messages");
class AdminUserService {
    constructor(_adminUserRepository) {
        this._adminUserRepository = _adminUserRepository;
    }
<<<<<<< HEAD
    getUsers(limit, page, searchTerm, filterStatus, sortBy) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._adminUserRepository.getUserAll(limit, page, searchTerm, filterStatus, sortBy);
=======
    getUsers(limit, page, searchTerm, filterStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._adminUserRepository.getUserAll(limit, page, searchTerm, filterStatus);
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
                if (result) {
                    return {
                        result: result.users,
                        success: true,
                        message: "Users fetched successfully",
                        total: result.total,
                    };
                }
                else {
                    return { success: false, message: "failed to fetch users" };
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
    userUpdate(id, formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._adminUserRepository.editUser(id, formData);
                if (response) {
                    return { success: true, message: "User edit successfully" };
                }
                else {
                    return { success: false, message: "failed to edit organiser" };
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
    userBlock(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._adminUserRepository.blockUser(user);
                if (response) {
                    console.log("reseee", response);
                    return {
                        user: response,
                        success: true,
                        message: "User blocked successfully",
                    };
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
    dashboardUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._adminUserRepository.getDashboardUsers();
                if (response) {
                    return {
                        success: true,
                        data: response.data,
                        totalUsers: response.totalUsers,
                    };
                }
                else {
                    return { success: false };
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
exports.AdminUserService = AdminUserService;
//# sourceMappingURL=adminUserService.js.map