import express from 'express';
import { messageController } from '../container/messagedi';
import { authMiddlewarwSet } from '../container/middleware.di';
const router=express.Router();
router.get('/message/:orgId/:userId',authMiddlewarwSet.userAndOrganiser,messageController.getMessages.bind(messageController))
export default router
