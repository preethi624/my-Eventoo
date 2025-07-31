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
exports.OrgAuthController = void 0;
const messages_1 = require("../constants/messages");
const statusCodeEnum_1 = require("../constants/statusCodeEnum");
class OrgAuthController {
    constructor(authService, setTokenService) {
        this.authService = authService;
        this.setTokenService = setTokenService;
    }
    ;
    organiserLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const result = yield this.authService.loginOrganiser(email, password);
                if (!result.success) {
                    res.status(statusCodeEnum_1.StatusCode.UNAUTHORIZED).json({ message: result.message });
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
    organiserRegister(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password } = req.body;
                const result = yield this.authService.registerOrganiser(name, email, password);
                if (!result.success) {
                    res.status(statusCodeEnum_1.StatusCode.UNAUTHORIZED).json({ message: result.message, success: false });
                    return;
                }
                res.status(statusCodeEnum_1.StatusCode.CREATED).json({ message: result.message, success: true });
            }
            catch (error) {
                console.log(error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error", success: false });
            }
        });
    }
    organiserVerify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password, otp } = req.body;
                const result = yield this.authService.organiserVerify({ name, email, password, otp });
                if (!result.success) {
                    res.status(statusCodeEnum_1.StatusCode.UNAUTHORIZED).json({ message: result.message, success: false });
                    return;
                }
                res.status(statusCodeEnum_1.StatusCode.OK).json({ message: result.message, success: true });
            }
            catch (error) {
                console.log(error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error", success: false });
            }
        });
    }
    organiserResend(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const result = yield this.authService.resendOrganiser({ email });
                if (!result.success) {
                    res.status(statusCodeEnum_1.StatusCode.UNAUTHORIZED).json({ message: result.message, success: false });
                    return;
                }
                res.status(statusCodeEnum_1.StatusCode.OK).json({ message: result.message, success: true });
            }
            catch (error) {
                console.error(error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error", success: false });
            }
        });
    }
    googleOrganiserLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { credential } = req.body;
                const result = yield this.authService.loginOrganiserWithGoogle(credential);
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
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
            }
        });
    }
}
exports.OrgAuthController = OrgAuthController;
//# sourceMappingURL=orgAuthController.js.map