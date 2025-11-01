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
    constructor(_userRepository) {
        this._userRepository = _userRepository;
    }
    userGet(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._userRepository.getUser(userId);
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
                const result = yield this._userRepository.updateUser(data, userId);
                console.log("resu;lt", result);
                if (result) {
                    return {
                        result: result,
                        success: true,
                        message: "user updated successfully",
                    };
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
    orgsGet(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._userRepository.getOrgs(userId);
                if (response) {
                    const organisers = response.map((org) => ({
                        _id: org._id,
                        name: org.name,
                        email: org.email,
                        isBlocked: org.isBlocked,
                        status: org.status,
                        latestBookedEvent: org.latestBookedEvent
                            ? {
                                eventId: org.latestBookedEvent.eventId,
                                title: org.latestBookedEvent.title,
                                date: org.latestBookedEvent.date,
                                venue: org.latestBookedEvent.venue,
                                createdAt: org.latestBookedEvent.createdAt,
                            }
                            : null,
                    }));
                    return { organisers: organisers, success: true };
                }
                else {
                    return { success: false };
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    passwordChange(userId, newPass, currentPass) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._userRepository.changePassword(userId, newPass, currentPass);
                if (response === null || response === void 0 ? void 0 : response.success) {
                    return { success: true };
                }
                else {
                    return { success: false };
                }
            }
            catch (error) {
                console.log(error);
                return { success: false };
            }
        });
    }
    venuesFetch() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._userRepository.fetchVenues();
                if (response) {
                    return { venues: response, success: true };
                }
                else {
                    return { success: false };
                }
            }
            catch (error) {
                console.log(error);
                return { success: false };
            }
        });
    }
    offerFetch(code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._userRepository.fetchOffer(code);
                if (response) {
                    return { offer: response, success: true };
                }
                else {
                    return { success: false };
                }
            }
            catch (error) {
                console.log(error);
                return { success: false };
            }
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=userService.js.map