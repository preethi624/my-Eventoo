import express from 'express';
import { eventController } from '../../container/event.di';
import { authMiddlewarwSet } from '../../container/middleware.di';

import multer from 'multer';
const upload = multer({ dest: 'uploads/' });
const router=express.Router();
router.post('/event',upload.array('images'), authMiddlewarwSet.organiserOnly,eventController.createEvent.bind(eventController));
router.delete('/event/:id',authMiddlewarwSet.organiserOnly,eventController.deleteEvent.bind(eventController));
router.put('/event/:id',authMiddlewarwSet.organiserOnly,eventController.editEvent.bind(eventController));
router.get('/events/:id',authMiddlewarwSet.organiserOnly,eventController.eventGet.bind(eventController));
router.get('/eventCount/:organiserId',authMiddlewarwSet.organiserOnly,eventController.getEventCount.bind(eventController))
export default router