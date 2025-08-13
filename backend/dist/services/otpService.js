"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPService = void 0;
class OTPService {
    generateOTP(length = 6) {
        const digits = "0123456789";
        let otp = "";
        for (let i = 0; i < length; i++) {
            otp += digits[Math.floor(Math.random() * 10)];
        }
        return otp;
    }
}
exports.OTPService = OTPService;
//# sourceMappingURL=otpService.js.map