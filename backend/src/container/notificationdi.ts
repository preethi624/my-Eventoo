import { NotificationController } from "../controllers/notificationController";
import { NotificationRepository } from "../repositories/notificationRepository";
import { NotificationService } from "../services/notificationService";


const notificationRepository=new NotificationRepository();
const notificationService=new NotificationService(notificationRepository);
export const notificationController=new NotificationController(notificationService)