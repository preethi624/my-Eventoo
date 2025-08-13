"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageController = exports.messageService = void 0;
const messageController_1 = require("../controllers/messageController");
const messageRepository_1 = require("../repositories/messageRepository");
const messageService_1 = require("../services/messageService");
const messageRepository = new messageRepository_1.MessageRepository();
exports.messageService = new messageService_1.MessageService(messageRepository);
exports.messageController = new messageController_1.MessageController(exports.messageService);
//# sourceMappingURL=messagedi.js.map