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
exports.UserRepository = void 0;
const user_1 = __importDefault(require("../model/user"));
const organiser_1 = __importDefault(require("../model/organiser"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const venue_1 = __importDefault(require("../model/venue"));
const offer_1 = __importDefault(require("../model/offer"));
class UserRepository {
    getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.default.findById(userId);
        });
    }
    updateUser(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, phone, location, aboutMe, profileImage } = data;
            return yield user_1.default.findByIdAndUpdate(userId, { name, phone, location, aboutMe: aboutMe, profileImage }, { new: true });
        });
    }
    getOrgs() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield organiser_1.default.find();
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    changePassword(userId, newPass, currentPass) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("new", newPass);
                const user = yield user_1.default.findById(userId);
                if (!user) {
                    throw new Error("user not found");
                }
                const isMatch = yield bcrypt_1.default.compare(currentPass, user.password);
                if (!isMatch) {
                    return { success: false };
                }
                const saltRounds = 10;
                const hashedPassword = yield bcrypt_1.default.hash(newPass, saltRounds);
                user.password = hashedPassword;
                yield user.save();
                return { success: true };
            }
            catch (error) {
                console.log(error);
                return { success: false };
            }
        });
    }
    fetchVenues() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield venue_1.default.find();
        });
    }
    fetchOffer(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield offer_1.default.findOne({ code });
        });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=userRepository.js.map