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
exports.UserAuthController = void 0;
const statusCodeEnum_1 = require("../constants/statusCodeEnum");
const messages_1 = require("../constants/messages");
class UserAuthController {
    constructor(authService, setTokenService) {
        this.authService = authService;
        this.setTokenService = setTokenService;
    }
    ;
    userLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const result = yield this.authService.loginUser(email, password);
                if (!result.success) {
                    res.status(401).json({ message: result.message });
                    return;
                }
                if (result.refreshToken) {
                    this.setTokenService.setRefreshToken(res, result.refreshToken);
                }
                res.json(result);
            }
            catch (error) {
                console.log(error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({ message: messages_1.MESSAGES.COMMON.SERVER_ERROR });
            }
        });
    }
    ;
    userRegister(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password } = req.body;
                const result = yield this.authService.registerUser(name, email, password);
                if (!result.success) {
                    res.status(statusCodeEnum_1.StatusCode.UNAUTHORIZED).json({ message: result.message, success: false });
                    return;
                }
                res.status(statusCodeEnum_1.StatusCode.CREATED).json({ message: result.message, success: true });
            }
            catch (error) {
                console.log(error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({ message: messages_1.MESSAGES.COMMON.SERVER_ERROR, success: false });
            }
        });
    }
    userVerify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password, otp } = req.body;
                const result = yield this.authService.userVerify({ name, email, password, otp });
                if (!result.success) {
                    res.status(statusCodeEnum_1.StatusCode.UNAUTHORIZED).json({ message: result.message, success: false });
                    return;
                }
                res.status(statusCodeEnum_1.StatusCode.OK).json({ message: result.message, success: true });
            }
            catch (error) {
                console.log(error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({ message: messages_1.MESSAGES.COMMON.SERVER_ERROR, success: false });
            }
        });
    }
    userResend(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const result = yield this.authService.resendUser({ email });
                if (!result.success) {
                    res.status(statusCodeEnum_1.StatusCode.UNAUTHORIZED).json({ message: result.message, success: false });
                    return;
                }
                res.status(statusCodeEnum_1.StatusCode.OK).json({ message: result.message, success: true });
            }
            catch (error) {
                console.error(error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({ message: messages_1.MESSAGES.COMMON.SERVER_ERROR, success: false });
            }
        });
    }
    googleUserLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { credential } = req.body;
                const result = yield this.authService.loginUserWithGoogle(credential);
                if (!result.success) {
                    res.status(statusCodeEnum_1.StatusCode.BAD_REQUEST).json({ message: result.message });
                    return;
                }
                if (result.refreshToken) {
                    this.setTokenService.setRefreshToken(res, result.refreshToken);
                }
                res.json({ token: result.accessToken });
            }
            catch (error) {
                console.log(error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({ message: messages_1.MESSAGES.COMMON.SERVER_ERROR });
            }
        });
    }
    handleRefreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
                if (!refreshToken) {
                    res.status(statusCodeEnum_1.StatusCode.UNAUTHORIZED).json({ message: 'No refresh token provided' });
                    return;
                }
                const newToken = yield this.authService.refreshTokens(refreshToken);
                if (!(newToken === null || newToken === void 0 ? void 0 : newToken.accessToken)) {
                    res.status(statusCodeEnum_1.StatusCode.FORBIDDEN).json({ message: 'Invalid refresh token' });
                    return;
                }
                res.json({ token: newToken.accessToken });
            }
            catch (error) {
                console.error('Refresh error:', error);
                res.status(statusCodeEnum_1.StatusCode.FORBIDDEN).json({ message: 'Invalid refresh token' });
            }
        });
    }
    ;
}
exports.UserAuthController = UserAuthController;
//# sourceMappingURL=userAuthController.js.map