"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationController = void 0;
const notificationController_1 = require("../controllers/notificationController");
const notificationRepository_1 = require("../repositories/notificationRepository");
const notificationService_1 = require("../services/notificationService");
const notificationRepository = new notificationRepository_1.NotificationRepository();
const notificationService = new notificationService_1.NotificationService(notificationRepository);
exports.notificationController = new notificationController_1.NotificationController(notificationService);
//# sourceMappingURL=notificationdi.js.map