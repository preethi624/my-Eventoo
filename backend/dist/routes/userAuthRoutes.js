"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_di_1 = require("../container/auth.di");
const router = express_1.default.Router();
router.post('/user/login', auth_di_1.authController.userLogin.bind(auth_di_1.authController));
router.post('/user/register', auth_di_1.authController.userRegister.bind(auth_di_1.authController));
router.post('/user/otp', auth_di_1.authController.userVerify.bind(auth_di_1.authController));
router.post('/user/resendOtp', auth_di_1.authController.userResend.bind(auth_di_1.authController));
router.post('/google/user', auth_di_1.authController.googleUserLogin.bind(auth_di_1.authController));
router.get('/refresh', auth_di_1.authController.handleRefreshToken.bind(auth_di_1.authController));
exports.default = router;
//# sourceMappingURL=userAuthRoutes.js.map