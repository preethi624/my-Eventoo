import express from 'express';
import { FileController } from '../controllers/fileController';

const router = express.Router();

const fileController=new FileController()
router.get('/files/:id', fileController.getFile.bind(fileController));

export default router;
