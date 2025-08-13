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
exports.MessageService = void 0;
class MessageService {
    constructor(_messageRepository) {
        this._messageRepository = _messageRepository;
    }
    handleIncomingMessage(senderId, receiverId, message, isOrganiser) {
        return __awaiter(this, void 0, void 0, function* () {
            const savedMessage = yield this._messageRepository.saveMessage(senderId, receiverId, message, isOrganiser);
            return savedMessage;
        });
    }
    messagesGet(orgId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._messageRepository.getMessages(orgId, userId);
                if (response) {
                    return { messages: response, success: true };
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
exports.MessageService = MessageService;
//# sourceMappingURL=messageService.js.map