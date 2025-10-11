"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messagedi_1 = require("../container/messagedi");
const middleware_di_1 = require("../container/middleware.di");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.get('/message/:orgId/:userId', middleware_di_1.authMiddlewarwSet.userAndOrganiser, messagedi_1.messageController.getMessages.bind(messagedi_1.messageController));
router.post('/message', upload.single("file"), middleware_di_1.authMiddlewarwSet.userAndOrganiser, messagedi_1.messageController.postMessages.bind(messagedi_1.messageController));
exports.default = router;
//# sourceMappingURL=messageRoutes.js.map