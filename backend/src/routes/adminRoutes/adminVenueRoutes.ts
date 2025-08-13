import express from "express";

import { authMiddlewarwSet } from "../../container/middleware.di";

import { adminVenueController } from "../../container/adminVenuedi";

import multer from "multer";
const upload = multer({ dest: "uploads/" });

const router = express.Router();
router.post(
  "/venue",
  upload.array("images"),
  authMiddlewarwSet.adminOnly,
  adminVenueController.createVenue.bind(adminVenueController)
);
router.get(
  "/venues",
  authMiddlewarwSet.adminOnly,
  adminVenueController.fetchVenues.bind(adminVenueController)
);
router.put(
  "/venue",
  authMiddlewarwSet.adminOnly,
  adminVenueController.editVenue.bind(adminVenueController)
);
router.delete(
  "/venue/:venueId",
  authMiddlewarwSet.adminOnly,
  adminVenueController.deleteVenue.bind(adminVenueController)
);

export default router;
