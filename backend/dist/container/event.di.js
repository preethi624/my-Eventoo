"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventController = void 0;
const eventController_1 = require("../controllers/eventController");
const eventRepository_1 = require("../repositories/eventRepository");
const eventService_1 = require("../services/eventService");
const eventRepository = new eventRepository_1.EventRepository();
const eventService = new eventService_1.EventService(eventRepository);
exports.eventController = new eventController_1.EventController(eventService); //in event di
//# sourceMappingURL=event.di.js.map