import express from 'express';
import { categoryController } from '../container/categorydi';
import { authMiddlewarwSet } from '../container/middleware.di';



const router=express.Router();
router.get('/categories',authMiddlewarwSet.userAndOrganiser,categoryController.getCategories.bind(categoryController));

export default router;   