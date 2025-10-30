import express from "express";


import { authMiddlewarwSet } from "../../container/middleware.di";
import { offerController } from "../../container/offerdi";
const router = express.Router();
router.get(
  "/",
  authMiddlewarwSet.userOnly,
  offerController.getOffers.bind(offerController)
);
router.get("/:offerId",authMiddlewarwSet.userOnly,offerController.getOfferDetails.bind(offerController))
export default router;