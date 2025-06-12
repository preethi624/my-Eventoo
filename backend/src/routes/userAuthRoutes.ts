import express from 'express';
import { authController } from '../container/auth.di';






const router = express.Router();
router.post('/user/login', authController.userLogin.bind(authController));
router.post('/user/register',authController.userRegister.bind(authController));
router.post('/user/otp',authController.userVerify.bind(authController));
router.post('/user/resendOtp',authController.userResend.bind(authController));
router.post('/google/user',authController.googleUserLogin.bind(authController));
router.get('/refresh', authController.handleRefreshToken.bind(authController));
export default router;