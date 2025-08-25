import express from 'express';

import { authMiddlewarwSet } from '../container/middleware.di';
import { reviewController } from '../container/reviewdi';
const router=express.Router()
router.post('/:eventId',authMiddlewarwSet.userOnly,reviewController.createReview.bind(reviewController));
router.get('/:eventId',authMiddlewarwSet.userAndOrganiser,reviewController.fetchReviews.bind(reviewController))
export default router