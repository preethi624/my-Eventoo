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
class UserRepository {
    getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.default.findById(userId);
        });
    }
    updateUser(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, phone, location, aboutMe, profileImage } = data;
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
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=userRepository.js.map