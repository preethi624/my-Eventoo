"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messagedi_1 = require("../container/messagedi");
const middleware_di_1 = require("../container/middleware.di");
const router = express_1.default.Router();
router.get('/message/:orgId/:userId', middleware_di_1.authMiddlewarwSet.userAndOrganiser, messagedi_1.messageController.getMessages.bind(messagedi_1.messageController));
exports.default = router;
//# sourceMappingURL=messageRoutes.js.map