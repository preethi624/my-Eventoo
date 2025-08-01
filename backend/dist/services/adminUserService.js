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
class AdminUserService {
    constructor(adminUserRepository) {
        this.adminUserRepository = adminUserRepository;
    }
    getUsers(limit, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminUserRepository.getUserAll(limit, page);
                if (result) {
                    return { result: result.users, success: true, message: "Users fetched successfully", total: result.total };
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
    userUpdate(id, formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminUserRepository.editUser(id, formData);
                if (response) {
                    return { success: true, message: "User edit successfully" };
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
    userBlock(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminUserRepository.blockUser(user);
                if (response) {
                    console.log("reseee", response);
                    return { user: response, success: true, message: "User blocked successfully" };
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
    dashboardUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminUserRepository.getDashboardUsers();
                if (response) {
                    return { success: true, data: response.data, totalUsers: response.totalUsers };
                }
                else {
                    return { success: false };
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
exports.AdminUserService = AdminUserService;
//# sourceMappingURL=adminUserService.js.map