import express from 'express';



import { authMiddlewarwSet } from '../../container/middleware.di';

import { adminEventController } from '../../container/adminEventdi';
const router = express.Router();
router.get('/events',authMiddlewarwSet.adminOnly,adminEventController.getAllEvents.bind(adminEventController));
router.put('/event/:id',authMiddlewarwSet.adminOnly,adminEventController.eventEdit.bind(adminEventController));
router.put('/event',authMiddlewarwSet.adminOnly,adminEventController.blockEvent.bind(adminEventController));
router.get('/dashboardEvents',authMiddlewarwSet.adminOnly,adminEventController.getDashboard.bind(adminEventController))

export default router