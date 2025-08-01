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
exports.UserService = void 0;
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    userGet(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userRepository.getUser(userId);
                if (result) {
                    return { user: result, success: true, message: "fetched success" };
                }
                else {
                    return { success: false, message: "failed to fetch" };
                }
            }
            catch (error) {
                console.log(error);
                return { success: false, message: "failed to fetch" };
            }
        });
    }
    userUpdate(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userRepository.updateUser(data, userId);
                console.log("resu;lt", result);
                if (result) {
                    return { result: result, success: true, message: "user updated successfully" };
                }
                else {
                    return { success: false, message: "failed to update" };
                }
            }
            catch (error) {
                console.log(error);
                return { success: false, message: "failed to update" };
            }
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=userService.js.map