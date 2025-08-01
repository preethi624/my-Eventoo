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
exports.AuthService = void 0;
const commonAuthRepository_1 = require("../repositories/commonAuthRepository");
class AuthService {
    constructor(otpService, emailService, passwordService) {
        this.otpService = otpService;
        this.emailService = emailService;
        this.passwordService = passwordService;
    }
    passwordForgot(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, userType }) {
            try {
                if (userType !== 'user' && userType !== 'organiser') {
                    throw new Error("Invalid user type");
                }
                const repo = commonAuthRepository_1.CommonAuthRepository.getRepository(userType);
                const account = yield repo.findByEmail(email);
                if (!account) {
                    return { success: false, message: "Email not exist" };
                }
                const otp = this.otpService.generateOTP();
                yield repo.createOTP(otp, email);
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'Password Reset OTP',
                    text: `Your OTP for password reset is: ${otp}\nThis OTP will expire in 10 minutes.`
                };
                yield this.emailService.sendMail(mailOptions);
                return { success: true, message: "OTP sent successfully" };
            }
            catch (error) {
                console.log(error);
                return { success: false, message: "Internal server error" };
            }
        });
    }
    verifyOtp(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, otp, userType }) {
            try {
                if (userType !== 'user' && userType !== 'organiser') {
                    throw new Error("Invalid user type");
                }
                const repo = commonAuthRepository_1.CommonAuthRepository.getRepository(userType);
                const Otp = yield repo.findOtp(email);
                if (!Otp) {
                    return { success: false, message: "OTP not found, please try again" };
                }
                if (otp != Otp.otp) {
                    return { success: false, message: "otp verification failed,please try again" };
                }
                return { success: true, message: "otp verified successfully" };
            }
            catch (error) {
                console.log(error);
                return { success: false, message: "Internal server error" };
            }
        });
    }
    resetPassword(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password, userType }) {
            try {
                const hashedPassword = yield this.passwordService.hashPassword(password);
                if (userType !== 'user' && userType !== 'organiser') {
                    throw new Error("Invalid user type");
                }
                const repo = commonAuthRepository_1.CommonAuthRepository.getRepository(userType);
                const account = repo.findByEmail(email);
                if (!account) {
                    return { success: false, message: "user not found" };
                }
                yield repo.updateAccount(email, hashedPassword);
                return { success: true, message: "password updated successfully" };
            }
            catch (error) {
                console.log(error);
                return { success: false, message: "Internal server error" };
            }
        });
    }
    forgotResend(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, userType }) {
            try {
                const otp = this.otpService.generateOTP();
                if (userType !== 'user' && userType !== 'organiser') {
                    throw new Error("Invalid user type");
                }
                const repo = commonAuthRepository_1.CommonAuthRepository.getRepository(userType);
                yield repo.createOTP(email, otp);
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'Password Reset OTP',
                    text: `Your OTP for password reset is: ${otp}\nThis OTP will expire in 10 minutes.`
                };
                yield this.emailService.sendMail(mailOptions);
                return ({ success: true, message: "otp send successfully" });
            }
            catch (error) {
                console.log(error);
                return { success: false, message: "Internal server error" };
            }
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map