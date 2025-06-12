import express from 'express';
import { authMiddlewarwSet } from '../../container/middleware.di';
import { organiserController } from '../../container/organiser.di';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });


const router=express.Router();
router.get('/organiser/:id',authMiddlewarwSet.organiserOnly,organiserController.getOrgById.bind(organiserController));
router.post('/checkStatus',authMiddlewarwSet.organiserOnly,organiserController.checkStatus.bind(organiserController));
router.put('/organiser/:organiserId',authMiddlewarwSet.organiserOnly,upload.single('image'), organiserController.updateOrganiser.bind(organiserController));
router.get('/orgOrder/:organiserId',authMiddlewarwSet.organiserOnly,organiserController.fetchBooking.bind(organiserController));
router.get('/orgOrders/:orderId',authMiddlewarwSet.organiserOnly,organiserController.getOrderDetails.bind(organiserController));
router.post('/organiserReapply/:orgId',authMiddlewarwSet.organiserOnly,organiserController.orgReapply.bind(organiserController))


export default router