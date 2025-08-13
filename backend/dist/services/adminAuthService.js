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
exports.AdminAuthService = void 0;
const messages_1 = require("../constants/messages");
class AdminAuthService {
    constructor(_authRepository, _tokenService, _passwordService) {
        this._authRepository = _authRepository;
        this._tokenService = _tokenService;
        this._passwordService = _passwordService;
    }
    loginAdmin(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password }) {
            try {
                const admin = yield this._authRepository.findAdminByEmail(email);
                if (!admin) {
                    return { message: messages_1.MESSAGES.COMMON.NOT_FOUND, success: false };
                }
                const isMatch = this._passwordService.comparePassword(password, admin.password);
                if (!isMatch) {
                    return { success: false, message: "Password not matching" };
                }
                const payload = { id: admin._id, role: "admin", email: admin.email };
                const accessToken = this._tokenService.generateAccessToken(payload);
                const refreshToken = this._tokenService.generateRefreshToken(payload);
                return {
                    success: true,
                    accessToken,
                    refreshToken,
                    message: "Login successfully",
                };
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
exports.AdminAuthService = AdminAuthService;
//# sourceMappingURL=adminAuthService.js.map