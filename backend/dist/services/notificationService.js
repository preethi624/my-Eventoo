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
exports.NotificationService = void 0;
class NotificationService {
    constructor(_notificationRepository) {
        this._notificationRepository = _notificationRepository;
    }
    notificationFetch(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._notificationRepository.fetchNotification(id);
                if (response) {
                    return { success: true, notifications: response };
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
    readMark(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._notificationRepository.markRead(id);
                if (response) {
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
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notificationService.js.map