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
exports.NotificationController = void 0;
class NotificationController {
    constructor(_notificationService) {
        this._notificationService = _notificationService;
    }
    fetchNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            console.log("orgId", userId);
            try {
                if (!userId)
                    throw new Error("userId not found");
                const response = yield this._notificationService.notificationFetch(userId);
                if (response.success) {
                    res.json({ success: true, notifications: response.notifications });
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
    markRead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const response = yield this._notificationService.readMark(id);
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
exports.NotificationController = NotificationController;
//# sourceMappingURL=notificationController.js.map