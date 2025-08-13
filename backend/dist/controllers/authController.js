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
exports.AuthController = void 0;
const statusCodeEnum_1 = require("../constants/statusCodeEnum");
const messages_1 = require("../constants/messages");
class AuthController {
    constructor(_authService) {
        this._authService = _authService;
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, userType } = req.body;
                const result = yield this._authService.passwordForgot({
                    email,
                    userType,
                });
                if (!result.success) {
                    res
                        .status(statusCodeEnum_1.StatusCode.UNAUTHORIZED)
                        .json({ message: result.message, success: false });
                    return;
                }
                res
                    .status(statusCodeEnum_1.StatusCode.OK)
                    .json({ message: result.message, success: true });
            }
            catch (error) {
                console.log(error);
                res
                    .status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR)
                    .json({ message: messages_1.MESSAGES.COMMON.SERVER_ERROR, success: false });
            }
        });
    }
    otpVerify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp, userType } = req.body;
                const result = yield this._authService.verifyOtp({
                    email,
                    otp,
                    userType,
                });
                if (!result.success) {
                    res
                        .status(statusCodeEnum_1.StatusCode.UNAUTHORIZED)
                        .json({ message: result.message, success: false });
                    return;
                }
                res
                    .status(statusCodeEnum_1.StatusCode.OK)
                    .json({ message: result.message, success: true });
            }
            catch (error) {
                console.log(error);
                res
                    .status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR)
                    .json({ message: messages_1.MESSAGES.COMMON.SERVER_ERROR, success: false });
            }
        });
    }
    passwordReset(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, userType } = req.body;
                const result = yield this._authService.resetPassword({
                    email,
                    password,
                    userType,
                });
                if (!result.success) {
                    res
                        .status(statusCodeEnum_1.StatusCode.UNAUTHORIZED)
                        .json({ message: result.message, success: false });
                    return;
                }
                res
                    .status(statusCodeEnum_1.StatusCode.OK)
                    .json({ message: result.message, success: true });
            }
            catch (error) {
                console.log(error);
                res
                    .status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR)
                    .json({ message: messages_1.MESSAGES.COMMON.SERVER_ERROR, success: false });
            }
        });
    }
    resendForgot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, userType } = req.body;
                const result = yield this._authService.forgotResend({
                    email,
                    userType,
                });
                if (!result.success) {
                    res
                        .status(statusCodeEnum_1.StatusCode.UNAUTHORIZED)
                        .json({ message: result.message, success: false });
                    return;
                }
                res
                    .status(statusCodeEnum_1.StatusCode.OK)
                    .json({ message: result.message, success: true });
            }
            catch (error) {
                console.error(error);
                res
                    .status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR)
                    .json({ message: messages_1.MESSAGES.COMMON.SERVER_ERROR, success: false });
            }
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map