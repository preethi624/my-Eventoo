import express from 'express';

import { authMiddlewarwSet } from '../container/middleware.di';
import { notificationController } from '../container/notificationdi';

const router=express.Router()
router.post('/:id',authMiddlewarwSet.userAndOrganiser,notificationController.markRead.bind(notificationController))
router.get('/',authMiddlewarwSet.userAndOrganiser,notificationController.fetchNotifications.bind(notificationController))
export default router