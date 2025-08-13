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
exports.ChatController = void 0;
const statusCodeEnum_1 = require("../constants/statusCodeEnum");
const messages_1 = require("../constants/messages");
class ChatController {
    constructor(_chatService) {
        this._chatService = _chatService;
    }
    createChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { message, userId } = req.body;
                const response = yield this._chatService.chatCreate(message, userId);
                if (response.success) {
                    res.json({
                        success: true,
                        message: messages_1.MESSAGES.CHAT.SUCCESS_CHAT,
                        response: response.result,
                    });
                }
                else {
                    res.json({ success: false, message: messages_1.MESSAGES.CHAT.FAILED_CHAT });
                }
            }
            catch (error) {
                console.error(error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.MESSAGES.CHAT.FAILED_CHAT,
                });
            }
        });
    }
}
exports.ChatController = ChatController;
//# sourceMappingURL=chatController.js.map