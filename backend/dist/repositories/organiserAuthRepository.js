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
exports.OrganiserAuthRepository = void 0;
const otp_1 = __importDefault(require("../model/otp"));
const organiser_1 = __importDefault(require("../model/organiser"));
class OrganiserAuthRepository {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield organiser_1.default.findOne({ email });
        });
    }
    findOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield otp_1.default.findOne({ email });
        });
    }
    updateAccount(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            yield organiser_1.default.findOneAndUpdate({ email }, { password }, { new: true });
        });
    }
    findOrganiserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield organiser_1.default.findOne({ email });
        });
    }
    createOrganiser(orgData) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdOrg = yield organiser_1.default.create(orgData);
            const organiserObject = createdOrg.toObject();
            return Object.assign(Object.assign({}, organiserObject), { _id: organiserObject._id.toString() });
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
            return yield otp_1.default.findOne({ email });
        });
    }
}
exports.OrganiserAuthRepository = OrganiserAuthRepository;
//# sourceMappingURL=organiserAuthRepository.js.map