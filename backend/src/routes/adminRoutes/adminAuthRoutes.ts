<<<<<<< HEAD
import express from 'express';


import { adminAuthController } from '../../container/adminAuthdi';

=======
import express, { Request, Response } from 'express';


import { adminAuthController } from '../../container/adminAuthdi';
import { authMiddlewarwSet } from '../../container/middleware.di';
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
const router = express.Router();
router.post('/admin/login', adminAuthController.adminLogin.bind(adminAuthController));
export default router