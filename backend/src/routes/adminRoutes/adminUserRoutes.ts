import express from "express";

import { authMiddlewarwSet } from "../../container/middleware.di";
import { adminController } from "../../container/adminUser.di";
const router = express.Router();
router.get(
  "/users",
  authMiddlewarwSet.adminOnly,
  adminController.getAllUsers.bind(adminController)
);
router.put(
  "/user/:id",
  authMiddlewarwSet.adminOnly,
  adminController.updateUser.bind(adminController)
);
router.put(
  "/user",
  authMiddlewarwSet.adminOnly,
  adminController.blockUser.bind(adminController)
);
router.get(
  "/dashboardUsers",
  authMiddlewarwSet.adminOnly,
  adminController.getDashboardUsers.bind(adminController)
);

export default router;
