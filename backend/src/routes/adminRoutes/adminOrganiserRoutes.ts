import express from "express";

import { authMiddlewarwSet } from "../../container/middleware.di";
import { adminOrgController } from "../../container/adminOrganiserdi";

const router = express.Router();
router.get(
  "/organisers",
  authMiddlewarwSet.adminOnly,
  adminOrgController.getAllOrganisers.bind(adminOrgController)
);
router.put(
  "/organiser/:id",
  authMiddlewarwSet.adminOnly,
  adminOrgController.updateOrganiser.bind(adminOrgController)
);
router.put(
  "/organiser",
  authMiddlewarwSet.adminOnly,
  adminOrgController.blockOrganiser.bind(adminOrgController)
);
export default router;
