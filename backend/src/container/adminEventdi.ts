import { AdminEventController } from "../controllers/adminEventController";
import { AdminEventRepository } from "../repositories/adminEventRepository";
import { AdminEventService } from "../services/adminEventService";

const adminEventRepository=new AdminEventRepository();



const adminEventService=new AdminEventService(adminEventRepository);
export const adminEventController=new AdminEventController(adminEventService)
