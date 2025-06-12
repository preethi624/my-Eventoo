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
exports.UserAuthRepository = void 0;
const otp_1 = __importDefault(require("../model/otp"));
const user_1 = __importDefault(require("../model/user"));
class UserAuthRepository {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.default.findOne({ email });
        });
    }
    findOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield otp_1.default.findOne({ email });
        });
    }
    updateAccount(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            yield user_1.default.findOneAndUpdate({ email }, { password }, { new: true });
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.default.findOne({ email });
        });
    }
    createOTP(otp, email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield otp_1.default.deleteMany({ email });
            yield otp_1.default.create({
                email,
                otp
            });
        });
    }
    findOtpByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("email", email);
            return yield otp_1.default.findOne({ email });
        });
    }
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            console.trace("createUser called");
            const existingUser = yield user_1.default.findOne({ email: userData.email });
            if (existingUser) {
                throw new Error("Email already registered");
            }
            const createdUser = yield user_1.default.create(userData);
            const userObject = createdUser.toObject();
            return Object.assign(Object.assign({}, userObject), { _id: userObject._id.toString() });
        });
    }
}
exports.UserAuthRepository = UserAuthRepository;
//# sourceMappingURL=userAuthRepository.js.map