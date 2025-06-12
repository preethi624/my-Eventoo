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
class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    createChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message = req.body;
                const response = yield this.chatService.chatCreate(message);
                if (response.success) {
                    res.json({ success: true, message: 'chat successfully', response: response.result });
                }
                else {
                    res.json({ success: false, message: "failed to chat" });
                }
            }
            catch (error) {
                console.error(error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Failed to chat",
                });
            }
        });
    }
}
exports.ChatController = ChatController;
//# sourceMappingURL=chatController.js.map