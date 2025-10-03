import express from "express";
import { authMiddlewarwSet } from "../../container/middleware.di";
import { userController } from "../../container/userProfiledi";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });
const router = express.Router();
router.get(
  "/user",
  authMiddlewarwSet.userOnly,
  userController.getUser.bind(userController)
);
router.put(
  "/user",
  authMiddlewarwSet.userOnly,
  upload.single("image"),
  userController.updateUser.bind(userController)
);
router.get(
  "/orgs",
  authMiddlewarwSet.userOnly,
  userController.getOrgs.bind(userController)
);
router.put('/',authMiddlewarwSet.userOnly,userController.changePassword.bind(userController))

export default router;
