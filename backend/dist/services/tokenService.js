"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class TokenService {
    generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign(payload, process.env.JWT_KEY, { expiresIn: "1h" });
    }
    generateRefreshToken(payload) {
        return jsonwebtoken_1.default.sign(payload, process.env.REFRESH_TOKEN_KEY, { expiresIn: "7d" });
    }
    verifyAccessToken(token) {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
    }
    verifyRefreshToken(token) {
        return jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_KEY);
    }
}
exports.TokenService = TokenService;
//# sourceMappingURL=tokenService.js.map