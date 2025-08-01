"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const event_di_1 = require("../../container/event.di");
const middleware_di_1 = require("../../container/middleware.di");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ dest: 'uploads/' });
const router = express_1.default.Router();
router.post('/event', upload.array('images'), middleware_di_1.authMiddlewarwSet.organiserOnly, event_di_1.eventController.createEvent.bind(event_di_1.eventController));
router.delete('/event/:id', middleware_di_1.authMiddlewarwSet.organiserOnly, event_di_1.eventController.deleteEvent.bind(event_di_1.eventController));
router.put('/event/:id', middleware_di_1.authMiddlewarwSet.organiserOnly, event_di_1.eventController.editEvent.bind(event_di_1.eventController));
router.get('/events/:id', middleware_di_1.authMiddlewarwSet.organiserOnly, event_di_1.eventController.eventGet.bind(event_di_1.eventController));
router.get('/eventCount', middleware_di_1.authMiddlewarwSet.organiserOnly, event_di_1.eventController.getEventCount.bind(event_di_1.eventController));
router.get('/dashboardEvents/:organiserId', middleware_di_1.authMiddlewarwSet.organiserOnly, event_di_1.eventController.getDashboardEvents.bind(event_di_1.eventController));
router.get('/orgEvents/:orgId', middleware_di_1.authMiddlewarwSet.organiserOnly, event_di_1.eventController.getOrgEvents.bind(event_di_1.eventController));
exports.default = router;
//# sourceMappingURL=eventOrgRoutes.js.map