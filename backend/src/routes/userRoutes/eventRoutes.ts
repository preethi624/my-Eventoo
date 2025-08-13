import express from "express";
import { eventController } from "../../container/event.di";

import { authMiddlewarwSet } from "../../container/middleware.di";
const router = express.Router();
router.get(
  "/events",
  authMiddlewarwSet.userAndOrganiser,
  eventController.getEvents.bind(eventController)
);
router.get(
  "/event/:id",
  authMiddlewarwSet.userOnly,
  eventController.getEventById.bind(eventController)
);
router.post(
  "/checkStatus",
  authMiddlewarwSet.userOnly,
  eventController.checkStatus.bind(eventController)
);
router.get(
  "/event",
  authMiddlewarwSet.userOnly,
  eventController.findEvent.bind(eventController)
);
router.get(
  "/eventsByCat",
  authMiddlewarwSet.userOnly,
  eventController.findEventsByCat.bind(eventController)
);

export default router;
