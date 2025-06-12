"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuthController = void 0;
const adminAuthController_1 = require("../controllers/adminAuthController");
const adminAuthRepository_1 = require("../repositories/adminAuthRepository");
const adminAuthService_1 = require("../services/adminAuthService");
const passwordService_1 = require("../services/passwordService");
const setTokenService_1 = require("../services/setTokenService");
const tokenService_1 = require("../services/tokenService");
const authRepository = new adminAuthRepository_1.AdminAuthRepository();
const tokenService = new tokenService_1.TokenService();
const passwordService = new passwordService_1.PasswordService();
const setTokenService = new setTokenService_1.SetTokenService();
const authService = new adminAuthService_1.AdminAuthService(authRepository, tokenService, passwordService);
exports.adminAuthController = new adminAuthController_1.AdminAuthController(authService, setTokenService);
//# sourceMappingURL=adminAuthdi.js.map