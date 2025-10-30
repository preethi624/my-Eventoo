import express from "express";
import { authMiddlewarwSet } from "../../container/middleware.di";
import { organiserController } from "../../container/organiser.di";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

const router = express.Router();
router.get(
  "/organiser/:id",
  authMiddlewarwSet.organiserOnly,
  organiserController.getOrgById.bind(organiserController)
);
router.post(
  "/checkStatus",
  authMiddlewarwSet.organiserOnly,
  organiserController.checkStatus.bind(organiserController)
);
router.put(
  "/organiser/:organiserId",
  authMiddlewarwSet.organiserOnly,
  upload.single("image"),
  organiserController.updateOrganiser.bind(organiserController)
);
router.get(
  "/orgOrder/:organiserId",
  authMiddlewarwSet.organiserOnly,
  organiserController.fetchBooking.bind(organiserController)
);
router.get(
  "/eventOrder/:eventId",authMiddlewarwSet.organiserOnly,organiserController.fetchEventOrder.bind(organiserController)

)
router.get(
  "/orgOrders/:orderId",
  authMiddlewarwSet.organiserOnly,
  organiserController.getOrderDetails.bind(organiserController)
);
router.post(
  "/organiserReapply/:orgId",
  authMiddlewarwSet.organiserOnly,
  organiserController.orgReapply.bind(organiserController)
);
router.get(
  "/venues",
  authMiddlewarwSet.organiserOnly,
  organiserController.getVenues.bind(organiserController)
);
router.get(
  "/venue/:venueId",
  authMiddlewarwSet.organiserOnly,
  organiserController.getVenueById.bind(organiserController)
);
router.get(
  "/getDashboard/:eventId",
  authMiddlewarwSet.organiserOnly,
  organiserController.getDashboard.bind(organiserController)
);
router.get(
  "/order/:eventId/:organiserId",
  authMiddlewarwSet.organiserOnly,
  organiserController.fetchAttendees.bind(organiserController)
);
router.get(
  "/dashboardEvents/:organiserId",
  authMiddlewarwSet.organiserOnly,
  organiserController.getDashboardEvents.bind(organiserController)
);
router.put(
  "/checkin",
  authMiddlewarwSet.organiserOnly,
  organiserController.updateTicket.bind(organiserController)
);
router.get(
  "/users",
  authMiddlewarwSet.organiserOnly,
  organiserController.getUsers.bind(organiserController)
);
router.post('/order/:orderId',authMiddlewarwSet.organiserOnly,organiserController.cancelOrder.bind(organiserController))
router.get('/venue',authMiddlewarwSet.organiserOnly,organiserController.fetchVenues.bind(organiserController))

export default router;
