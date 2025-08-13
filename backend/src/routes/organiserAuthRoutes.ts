import express from "express";
import { authController } from "../container/orgAuthdi";

const router = express.Router();
router.post(
  "/organiser/login",
  authController.organiserLogin.bind(authController)
);
router.post(
  "/organiser/register",
  authController.organiserRegister.bind(authController)
);
router.post(
  "/organiser/otp",
  authController.organiserVerify.bind(authController)
);
router.post(
  "/organiser/resendOtp",
  authController.organiserResend.bind(authController)
);
router.post(
  "/google/organiser",
  authController.googleOrganiserLogin.bind(authController)
);
export default router;
