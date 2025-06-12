"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const authController_1 = require("../controllers/authController");
const authService_1 = require("../services/authService");
const mailService_1 = require("../services/mailService");
const otpService_1 = require("../services/otpService");
const passwordService_1 = require("../services/passwordService");
const otpService = new otpService_1.OTPService();
const mailService = new mailService_1.MailService();
const passwordService = new passwordService_1.PasswordService;
const authService = new authService_1.AuthService(otpService, mailService, passwordService);
exports.authController = new authController_1.AuthController(authService);
//# sourceMappingURL=commonAuth.di.js.map