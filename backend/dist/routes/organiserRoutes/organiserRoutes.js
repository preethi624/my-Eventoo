"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_di_1 = require("../../container/middleware.di");
const organiser_di_1 = require("../../container/organiser.di");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = (0, multer_1.default)({ storage });
const router = express_1.default.Router();
router.get("/organiser/:id", middleware_di_1.authMiddlewarwSet.organiserOnly, organiser_di_1.organiserController.getOrgById.bind(organiser_di_1.organiserController));
router.post("/checkStatus", middleware_di_1.authMiddlewarwSet.organiserOnly, organiser_di_1.organiserController.checkStatus.bind(organiser_di_1.organiserController));
router.put("/organiser/:organiserId", middleware_di_1.authMiddlewarwSet.organiserOnly, upload.single("image"), organiser_di_1.organiserController.updateOrganiser.bind(organiser_di_1.organiserController));
router.get("/orgOrder/:organiserId", middleware_di_1.authMiddlewarwSet.organiserOnly, organiser_di_1.organiserController.fetchBooking.bind(organiser_di_1.organiserController));
router.get("/eventOrder/:eventId", middleware_di_1.authMiddlewarwSet.organiserOnly, organiser_di_1.organiserController.fetchEventOrder.bind(organiser_di_1.organiserController));
router.get("/orgOrders/:orderId", middleware_di_1.authMiddlewarwSet.organiserOnly, organiser_di_1.organiserController.getOrderDetails.bind(organiser_di_1.organiserController));
router.post("/organiserReapply/:orgId", middleware_di_1.authMiddlewarwSet.organiserOnly, organiser_di_1.organiserController.orgReapply.bind(organiser_di_1.organiserController));
router.get("/venues", middleware_di_1.authMiddlewarwSet.organiserOnly, organiser_di_1.organiserController.getVenues.bind(organiser_di_1.organiserController));
router.get("/venue/:venueId", middleware_di_1.authMiddlewarwSet.organiserOnly, organiser_di_1.organiserController.getVenueById.bind(organiser_di_1.organiserController));
router.get("/getDashboard/:eventId", middleware_di_1.authMiddlewarwSet.organiserOnly, organiser_di_1.organiserController.getDashboard.bind(organiser_di_1.organiserController));
router.get("/order/:eventId/:organiserId", middleware_di_1.authMiddlewarwSet.organiserOnly, organiser_di_1.organiserController.fetchAttendees.bind(organiser_di_1.organiserController));
router.get("/dashboardEvents/:organiserId", middleware_di_1.authMiddlewarwSet.organiserOnly, organiser_di_1.organiserController.getDashboardEvents.bind(organiser_di_1.organiserController));
router.put("/checkin", middleware_di_1.authMiddlewarwSet.organiserOnly, organiser_di_1.organiserController.updateTicket.bind(organiser_di_1.organiserController));
router.get("/users", middleware_di_1.authMiddlewarwSet.organiserOnly, organiser_di_1.organiserController.getUsers.bind(organiser_di_1.organiserController));
router.post('/order/:orderId', middleware_di_1.authMiddlewarwSet.organiserOnly, organiser_di_1.organiserController.cancelOrder.bind(organiser_di_1.organiserController));
router.get('/venues', middleware_di_1.authMiddlewarwSet.organiserOnly, organiser_di_1.organiserController.fetchVenues.bind(organiser_di_1.organiserController));
exports.default = router;
//# sourceMappingURL=organiserRoutes.js.map