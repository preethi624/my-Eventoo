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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuthService = void 0;
const google_auth_library_1 = require("google-auth-library");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
class UserAuthService {
    constructor(_authRepository, _otpService, _mailService, _tokenService, _passwordService) {
        this._authRepository = _authRepository;
        this._otpService = _otpService;
        this._mailService = _mailService;
        this._tokenService = _tokenService;
        this._passwordService = _passwordService;
    }
    loginUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._authRepository.findUserByEmail(email);
            if (!user)
                return { success: false, message: "User not found" };
            const isMatch = yield this._passwordService.comparePassword(password, user.password);
            if (!isMatch)
                return { success: false, message: "password not matching" };
            if (user.isBlocked) {
                return {
                    success: false,
                    message: "Your account has been blocked.Please contact support",
                };
            }
            const payload = { id: user._id, role: "user", email: user.email };
            const accessToken = this._tokenService.generateAccessToken(payload);
            const refreshToken = this._tokenService.generateRefreshToken(payload);
            return {
                success: true,
                message: "Login successful",
                accessToken,
                refreshToken,
            };
        });
    }
    registerUser(name, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield this._authRepository.findUserByEmail(email);
                if (existingUser)
                    return { success: false, message: "User already exists" };
                const otp = this._otpService.generateOTP();
                yield this._authRepository.createOTP(otp, email);
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: "Password Reset OTP",
                    text: `Your OTP for password reset is: ${otp}\nThis OTP will expire in 10 minutes.`,
                };
                yield this._mailService.sendMail(mailOptions);
                return { success: true, message: "OTP sent to your email" };
            }
            catch (error) {
                console.error("Error in registerUser:", error);
                return { success: false, message: "Internal server error" };
            }
        });
    }
    userVerify(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, email, password, otp, }) {
            try {
                const OTP = yield this._authRepository.findOtpByEmail(email);
                if (!OTP) {
                    return { success: false, message: "OTP not found, please try again" };
                }
                if (OTP.otp != otp) {
                    return {
                        success: false,
                        message: "otp verification failed,please try again",
                    };
                }
                const hashedPassword = yield this._passwordService.hashPassword(password);
                yield this._authRepository.createUser({
                    name,
                    email,
                    password: hashedPassword,
                });
                return { success: true, message: "User registered successfully" };
            }
            catch (error) {
                console.error("Error in otpVerification:", error);
                return { success: false, message: "Internal server error" };
            }
        });
    }
    resendUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email }) {
            try {
                const otp = this._otpService.generateOTP();
                yield this._authRepository.createOTP(otp, email);
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: "Password Reset OTP",
                    text: `Your OTP for password reset is: ${otp}\nThis OTP will expire in 10 minutes.`,
                };
                yield this._mailService.sendMail(mailOptions);
                return { success: true, message: "otp send successfully" };
            }
            catch (error) {
                console.log(error);
                return { success: false, message: "Internal server error" };
            }
        });
    }
    loginUserWithGoogle(credential) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const googleClientId = process.env.GOOGLE_CLIENT_ID;
                if (!googleClientId)
                    throw new Error("Missing GOOGLE_CLIENT_ID in environment variables");
                const ticket = yield client.verifyIdToken({
                    idToken: credential,
                    audience: googleClientId,
                });
                const jwtkey = process.env.JWT_KEY;
                if (!jwtkey)
                    throw new Error("Missing JWT_KEY in environment variables");
                const payload = ticket.getPayload();
                if (!payload)
                    throw new Error("Invalid token payload");
                const { email, name, picture, sub: googleId } = payload;
                if (!name || !email || !picture || !googleId) {
                    throw new Error("Missing required user information from Google payload");
                }
                let user = yield this._authRepository.findUserByEmail(email);
                if (!user) {
                    user = yield this._authRepository.createUser({
                        name,
                        email,
                        picture,
                        googleId,
                        authMethod: "google",
                    });
                }
                if (user.isBlocked) {
                    return {
                        success: false,
                        message: "Your account has been blocked. Please contact support.",
                    };
                }
                const { exp, iat } = payload, cleanPayload = __rest(payload, ["exp", "iat"]);
                console.log("expired at", exp, iat);
                const accessToken = this._tokenService.generateAccessToken(Object.assign(Object.assign({}, cleanPayload), { role: "user", id: user._id }));
                const refreshToken = this._tokenService.generateRefreshToken(Object.assign(Object.assign({}, cleanPayload), { role: "user", id: user._id }));
                return { success: true, accessToken, refreshToken, message: "success" };
            }
            catch (error) {
                console.error("Error in loginUserWithGoogle:", error);
                return { success: false, message: "Google authentication failed" };
            }
        });
    }
    refreshTokens(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = this._tokenService.verifyRefreshToken(refreshToken);
                if (typeof decoded === "string" ||
                    !decoded ||
                    typeof decoded !== "object") {
                    throw new Error("Invalid token payload");
                }
                const payload = {
                    id: decoded.id,
                    role: decoded.role,
                    email: decoded.email,
                };
                const newAccessToken = this._tokenService.generateAccessToken(payload);
                return { accessToken: newAccessToken };
            }
            catch (error) {
                console.error("Token refresh error:", error);
                return { accessToken: null };
            }
        });
    }
}
exports.UserAuthService = UserAuthService;
//# sourceMappingURL=userAuthServices.js.map