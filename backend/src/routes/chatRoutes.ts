import express from 'express';
import { chatController } from '../container/chatdi';
import { authMiddlewarwSet } from '../container/middleware.di';
const router=express.Router()
router.post('/chat',authMiddlewarwSet.userAndOrganiser,chatController.createChat.bind(chatController));
export default router