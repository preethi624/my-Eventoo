import express from 'express';
import { messageController } from '../container/messagedi';
import { authMiddlewarwSet } from '../container/middleware.di';
import multer from 'multer';
const router=express.Router();
const upload=multer({storage:multer.memoryStorage()})
router.get('/message/:orgId/:userId',authMiddlewarwSet.userAndOrganiser,messageController.getMessages.bind(messageController));
router.post('/message',upload.single("file"), authMiddlewarwSet.userAndOrganiser,messageController.postMessages.bind(messageController))
export default router
