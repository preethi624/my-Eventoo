import express, { Request, Response } from 'express';


import { adminAuthController } from '../../container/adminAuthdi';
import { authMiddlewarwSet } from '../../container/middleware.di';
const router = express.Router();
router.post('/admin/login', adminAuthController.adminLogin.bind(adminAuthController));
export default router