"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_di_1 = require("../../container/middleware.di");
const adminEventdi_1 = require("../../container/adminEventdi");
const router = express_1.default.Router();
router.get("/events", middleware_di_1.authMiddlewarwSet.adminOnly, adminEventdi_1.adminEventController.getAllEvents.bind(adminEventdi_1.adminEventController));
router.put("/event/:id", middleware_di_1.authMiddlewarwSet.adminOnly, adminEventdi_1.adminEventController.eventEdit.bind(adminEventdi_1.adminEventController));
router.put("/event", middleware_di_1.authMiddlewarwSet.adminOnly, adminEventdi_1.adminEventController.blockEvent.bind(adminEventdi_1.adminEventController));
router.get("/dashboardEvents", middleware_di_1.authMiddlewarwSet.adminOnly, adminEventdi_1.adminEventController.getDashboard.bind(adminEventdi_1.adminEventController));
exports.default = router;
//# sourceMappingURL=adminEventRoutes.js.map