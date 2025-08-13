"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_di_1 = require("../../container/middleware.di");
const adminVenuedi_1 = require("../../container/adminVenuedi");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ dest: "uploads/" });
const router = express_1.default.Router();
router.post("/venue", upload.array("images"), middleware_di_1.authMiddlewarwSet.adminOnly, adminVenuedi_1.adminVenueController.createVenue.bind(adminVenuedi_1.adminVenueController));
router.get("/venues", middleware_di_1.authMiddlewarwSet.adminOnly, adminVenuedi_1.adminVenueController.fetchVenues.bind(adminVenuedi_1.adminVenueController));
router.put("/venue", middleware_di_1.authMiddlewarwSet.adminOnly, adminVenuedi_1.adminVenueController.editVenue.bind(adminVenuedi_1.adminVenueController));
router.delete("/venue/:venueId", middleware_di_1.authMiddlewarwSet.adminOnly, adminVenuedi_1.adminVenueController.deleteVenue.bind(adminVenuedi_1.adminVenueController));
exports.default = router;
//# sourceMappingURL=adminVenueRoutes.js.map