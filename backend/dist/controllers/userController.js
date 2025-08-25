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
exports.UserController = void 0;
const messages_1 = require("../constants/messages");
class UserController {
    constructor(_userService) {
        this._userService = _userService;
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    throw new Error("userId not get");
                }
                const response = yield this._userService.userGet(userId);
                if (response) {
                    res.json({
                        user: response,
                        success: true,
                        message: "fetched user successfully",
                    });
                }
                else {
                    res.json({ success: false, message: messages_1.MESSAGES.EVENT.FAILED_TO_FETCH });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { name, email, phone, location, aboutMe } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const image = (_b = req.file) === null || _b === void 0 ? void 0 : _b.filename;
                console.log("image", image);
                const data = {
                    name,
                    email,
                    phone,
                    location,
                    aboutMe,
                    profileImage: image,
                };
                if (!userId) {
                    throw new Error("userId not get");
                }
                const response = yield this._userService.userUpdate(data, userId);
                if (response.success) {
                    res.json({
                        result: response.result,
                        success: true,
                        message: "user updated ",
                    });
                }
                else {
                    res.json({ success: false, message: messages_1.MESSAGES.EVENT.FAILED_TO_UPDATE });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getOrgs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._userService.orgsGet();
                if (response.success) {
                    res.json({ response });
                }
                else {
                    res.json({ success: false });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const newPass = String(req.body.newPass);
            const currentPass = String(req.body.currentPass);
            console.log("newPass", newPass);
            try {
                if (!userId)
                    throw new Error("userId not found");
                const response = yield this._userService.passwordChange(userId, newPass, currentPass);
                if (response.success) {
                    res.json({ success: true });
                }
                else {
                    res.json({ success: false });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=userController.js.map