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
exports.ChatService = void 0;
const messages_1 = require("../constants/messages");
class ChatService {
    constructor(_chatRepository) {
        this._chatRepository = _chatRepository;
    }
    chatCreate(message, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._chatRepository.createChat(message, userId);
                if (result) {
                    return {
                        success: true,
                        message: messages_1.MESSAGES.CHAT.SUCCESS_CHAT,
                        result: result.text,
                    };
                }
                else {
                    return { success: false, message: messages_1.MESSAGES.CHAT.FAILED_CHAT };
                }
            }
            catch (error) {
                console.log(error);
                return { success: false, message: messages_1.MESSAGES.CHAT.FAILED_CHAT };
            }
        });
    }
}
exports.ChatService = ChatService;
//# sourceMappingURL=chatService.js.map