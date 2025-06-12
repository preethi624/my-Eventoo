"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
const adminUserController_1 = require("../controllers/adminUserController");
const adminUserRepository_1 = require("../repositories/adminUserRepository");
const adminUserService_1 = require("../services/adminUserService");
const adminRepository = new adminUserRepository_1.AdminUserRepository();
const adminService = new adminUserService_1.AdminUserService(adminRepository);
exports.adminController = new adminUserController_1.AdminUserController(adminService);
//# sourceMappingURL=admin.di.js.map