import express from "express";
import { eventController } from "../../container/event.di";
import { authMiddlewarwSet } from "../../container/middleware.di";

<<<<<<< HEAD

=======
import multer from "multer";
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
import { upload } from "../../middleware/upload";

const router = express.Router();
router.post(
  "/event",
  upload.array("images"),
  authMiddlewarwSet.organiserOnly,
  eventController.createEvent.bind(eventController)
);
router.delete(
  "/event/:id",
  authMiddlewarwSet.organiserOnly,
  eventController.deleteEvent.bind(eventController)
);
router.put(
  "/event/:id",
<<<<<<< HEAD
  upload.single("image"),
=======
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
  authMiddlewarwSet.organiserOnly,
  eventController.editEvent.bind(eventController)
);
router.get(
  "/events/:id",
  authMiddlewarwSet.organiserOnly,
  eventController.eventGet.bind(eventController)
);
router.get(
  "/eventCount",
  authMiddlewarwSet.organiserOnly,
  eventController.getEventCount.bind(eventController)
);
router.get(
  "/dashboardEvents/:organiserId",
  authMiddlewarwSet.organiserOnly,
  eventController.getDashboardEvents.bind(eventController)
);
router.get(
  "/orgEvents/:orgId",
  authMiddlewarwSet.organiserOnly,
  eventController.getOrgEvents.bind(eventController)
);
export default router;
