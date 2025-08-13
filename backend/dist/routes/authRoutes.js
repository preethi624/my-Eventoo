"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commonAuth_di_1 = require("../container/commonAuth.di");
const router = express_1.default.Router();
router.post("/forgotPassword", commonAuth_di_1.authController.forgotPassword.bind(commonAuth_di_1.authController));
router.post("/verifyOtp", commonAuth_di_1.authController.otpVerify.bind(commonAuth_di_1.authController));
router.post("/resetPassword", commonAuth_di_1.authController.passwordReset.bind(commonAuth_di_1.authController));
router.post("/resendOTP", commonAuth_di_1.authController.resendForgot.bind(commonAuth_di_1.authController));
exports.default = router;
//# sourceMappingURL=authRoutes.js.map