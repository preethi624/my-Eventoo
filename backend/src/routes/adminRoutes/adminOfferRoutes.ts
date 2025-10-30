import express from "express";

import { authMiddlewarwSet } from "../../container/middleware.di";




import { adminOfferController } from "../../container/adminOfferdi";
import { upload } from "../../middleware/upload";


const router = express.Router();
router.post(
  "/offer",
  upload.array("images"),
  authMiddlewarwSet.adminOnly,
  adminOfferController.createOffer.bind(adminOfferController)
);
router.get('/offers',authMiddlewarwSet.adminOnly,adminOfferController.fetchOffers.bind(adminOfferController))
router.delete('/offer/:offerId',authMiddlewarwSet.adminOnly,adminOfferController.deleteOffer.bind(adminOfferController));
router.put(
  "/offer/:offerId",
  upload.single("image"),
  authMiddlewarwSet.adminOnly,
  adminOfferController.editOffer.bind(adminOfferController)
);
export default router;