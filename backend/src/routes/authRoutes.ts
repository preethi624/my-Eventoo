import express from "express";
import { authController } from "../container/commonAuth.di";

const router = express.Router();
router.post(
  "/forgotPassword",
  authController.forgotPassword.bind(authController)
);
router.post("/verifyOtp", authController.otpVerify.bind(authController));
router.post(
  "/resetPassword",
  authController.passwordReset.bind(authController)
);
router.post("/resendOTP", authController.resendForgot.bind(authController));

export default router;
