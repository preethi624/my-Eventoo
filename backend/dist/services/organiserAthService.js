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
class OrganiserAuthService {
    constructor(authRepository, otpService, mailService, tokenService, passwordService) {
        this.authRepository = authRepository;
        this.otpService = otpService;
        this.mailService = mailService;
        this.tokenService = tokenService;
        this.passwordService = passwordService;
    }
    loginOrganiser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const organiser = yield this.authRepository.findOrganiserByEmail(email);
            if (!organiser)
                return { success: false, message: "Organiser not found" };
            const isMatch = yield this.passwordService.comparePassword(password, organiser.password);
            if (!isMatch)
                return { success: false, message: "password not matching" };
            if (organiser.isBlocked) {
                return { success: false, message: "Your account has been blocked.Please contact support" };
            }
            const payload = { id: organiser._id, role: "organiser", email: organiser.email };
            const accessToken = this.tokenService.generateAccessToken(payload);
            const refreshToken = this.tokenService.generateRefreshToken(payload);
            /*const accessToken = jwt.sign(
          { id: user._id, role: "user", email: user.email },
          process.env.JWT_KEY as string,
          { expiresIn: "1h" }
        );
        const refreshToken = jwt.sign(
          { id: user._id, role: "user", email: user.email },
          process.env.REFRESH_TOKEN_KEY as string,
          { expiresIn: "7d" }
        );*/
            return {
                success: true,
                message: "Login successful",
                accessToken,
                refreshToken,
            };
        });
    }
    registerOrganiser(name, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingOrganiser = yield this.authRepository.findOrganiserByEmail(email);
                if (existingOrganiser)
                    return { success: false, message: "Organiser already exists" };
                const otp = this.otpService.generateOTP();
                yield this.authRepository.createOTP(otp, email);
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'Password Reset OTP',
                    text: `Your OTP for password reset is: ${otp}\nThis OTP will expire in 10 minutes.`
                };
                yield this.mailService.sendMail(mailOptions);
                return { success: true, message: "OTP sent to your email" };
            }
            catch (error) {
                console.error("Error in registerUser:", error);
                return { success: false, message: "Internal server error" };
            }
        });
    }
    organiserVerify(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, email, password, otp }) {
            try {
                const OTP = yield this.authRepository.findOtpByEmail(email);
                if (!OTP) {
                    return { success: false, message: "OTP not found, please try again" };
                }
                if (OTP.otp != otp) {
                    return { success: false, message: "otp verification failed,please try again" };
                }
                const hashedPassword = yield this.passwordService.hashPassword(password);
                yield this.authRepository.createOrganiser({ name, email, password: hashedPassword });
                return { success: true, message: "User registered successfully" };
            }
            catch (error) {
                console.error("Error in otpVerification:", error);
                return { success: false, message: "Internal server error" };
            }
        });
    }
    resendOrganiser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email }) {
            try {
                const otp = this.otpService.generateOTP();
                yield this.authRepository.createOTP(otp, email);
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'Password Reset OTP',
                    text: `Your OTP for password reset is: ${otp}\nThis OTP will expire in 10 minutes.`
                };
                yield this.mailService.sendMail(mailOptions);
                return ({ success: true, message: "otp send successfully" });
            }
            catch (error) {
                return { success: false, message: "Internal server error" };
            }
        });
    }
}
//# sourceMappingURL=organiserAthService.js.map