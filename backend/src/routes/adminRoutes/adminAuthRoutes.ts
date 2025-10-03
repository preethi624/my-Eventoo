import express from 'express';


import { adminAuthController } from '../../container/adminAuthdi';

const router = express.Router();
router.post('/admin/login', adminAuthController.adminLogin.bind(adminAuthController));
export default router