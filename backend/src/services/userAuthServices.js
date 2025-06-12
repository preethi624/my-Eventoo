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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserAuthService {
    constructor(authRepository) {
        this.authRepository = authRepository;
    }
    loginUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.authRepository.findUserByEmail(email);
            if (!user)
                return { success: false, message: "User not found" };
            const isMatch = bcrypt_1.default.compare(password, user.password);
            if (!isMatch)
                return { success: false, message: "password not matching" };
            if (user.isBlocked) {
                return { success: false, message: "Your account has been blocked.Please contact support" };
            }
            const accessToken = jsonwebtoken_1.default.sign({ id: user._id, role: "user", email: user.email }, process.env.JWT_KEY, { expiresIn: "1h" });
            const refreshToken = jsonwebtoken_1.default.sign({ id: user._id, role: "user", email: user.email }, process.env.REFRESH_TOKEN_KEY, { expiresIn: "7d" });
            return {
                success: true,
                message: "Login successful",
                accessToken,
                refreshToken,
            };
        });
    }
}
exports.UserAuthService = UserAuthService;
