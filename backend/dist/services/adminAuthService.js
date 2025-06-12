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
class AdminAuthService {
    constructor(authRepository, tokenService, passwordService) {
        this.authRepository = authRepository;
        this.tokenService = tokenService;
        this.passwordService = passwordService;
    }
    loginAdmin(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password }) {
            try {
                const admin = yield this.authRepository.findAdminByEmail(email);
                if (!admin) {
                    return { message: "email not found", success: false };
                }
                const isMatch = this.passwordService.comparePassword(password, admin.password);
                if (!isMatch) {
                    return { success: false, message: "Password not matching" };
                }
                const payload = { id: admin._id, role: "admin", email: admin.email };
                const accessToken = this.tokenService.generateAccessToken(payload);
                const refreshToken = this.tokenService.generateRefreshToken(payload);
                return {
                    success: true,
                    accessToken,
                    refreshToken,
                    message: "Login successfully"
                };
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
exports.AdminAuthService = AdminAuthService;
//# sourceMappingURL=adminAuthService.js.map