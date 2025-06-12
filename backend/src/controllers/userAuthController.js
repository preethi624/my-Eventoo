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
class UserAuthController {
    constructor(authService) {
        this.authService = authService;
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
                    res.cookie("refreshToken", result.refreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "strict",
                        path: "/refresh-token",
                        maxAge: 7 * 24 * 60 * 60 * 1000,
                    });
                }
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
    ;
}
exports.UserAuthController = UserAuthController;
