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
exports.MessageController = void 0;
class MessageController {
    constructor(_messageService) {
        this._messageService = _messageService;
    }
    ;
    getMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { orgId, userId } = req.params;
            try {
                const response = yield this._messageService.messagesGet(orgId, userId);
                if (response.success) {
                    res.json({ sucess: true, messages: response.messages });
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
exports.MessageController = MessageController;
//# sourceMappingURL=messageController.js.map