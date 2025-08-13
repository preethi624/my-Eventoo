"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const event_di_1 = require("../../container/event.di");
const middleware_di_1 = require("../../container/middleware.di");
const router = express_1.default.Router();
router.get("/events", middleware_di_1.authMiddlewarwSet.userAndOrganiser, event_di_1.eventController.getEvents.bind(event_di_1.eventController));
router.get("/event/:id", middleware_di_1.authMiddlewarwSet.userOnly, event_di_1.eventController.getEventById.bind(event_di_1.eventController));
router.post("/checkStatus", middleware_di_1.authMiddlewarwSet.userOnly, event_di_1.eventController.checkStatus.bind(event_di_1.eventController));
router.get("/event", middleware_di_1.authMiddlewarwSet.userOnly, event_di_1.eventController.findEvent.bind(event_di_1.eventController));
router.get("/eventsByCat", middleware_di_1.authMiddlewarwSet.userOnly, event_di_1.eventController.findEventsByCat.bind(event_di_1.eventController));
exports.default = router;
//# sourceMappingURL=eventRoutes.js.map