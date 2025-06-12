"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatController = void 0;
const chatController_1 = require("../controllers/chatController");
const chatRepository_1 = require("../repositories/chatRepository");
const chatService_1 = require("../services/chatService");
const chatRepository = new chatRepository_1.ChatRepository();
const chatService = new chatService_1.ChatService(chatRepository);
exports.chatController = new chatController_1.ChatController(chatService);
//# sourceMappingURL=chatdi.js.map