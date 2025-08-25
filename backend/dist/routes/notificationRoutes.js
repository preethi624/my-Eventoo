"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_di_1 = require("../container/middleware.di");
const notificationdi_1 = require("../container/notificationdi");
const router = express_1.default.Router();
router.post('/:id', middleware_di_1.authMiddlewarwSet.userAndOrganiser, notificationdi_1.notificationController.markRead.bind(notificationdi_1.notificationController));
router.get('/', middleware_di_1.authMiddlewarwSet.userAndOrganiser, notificationdi_1.notificationController.fetchNotifications.bind(notificationdi_1.notificationController));
exports.default = router;
//# sourceMappingURL=notificationRoutes.js.map