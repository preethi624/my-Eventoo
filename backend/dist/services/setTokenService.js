"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetTokenService = void 0;
class SetTokenService {
    setRefreshToken(res, token) {
        res.cookie("refreshToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }
}
exports.SetTokenService = SetTokenService;
//# sourceMappingURL=setTokenService.js.map