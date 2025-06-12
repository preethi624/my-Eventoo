"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatdi_1 = require("../container/chatdi");
const middleware_di_1 = require("../container/middleware.di");
const router = express_1.default.Router();
router.post('/chat', middleware_di_1.authMiddlewarwSet.userAndOrganiser, chatdi_1.chatController.createChat.bind(chatdi_1.chatController));
exports.default = router;
//# sourceMappingURL=chatRoutes.js.map