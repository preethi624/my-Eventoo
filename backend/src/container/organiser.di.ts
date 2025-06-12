import { OrganiserController } from "../controllers/organiserController";
import { OrganiserRepository } from "../repositories/organiserRepository";

import { OrganiserService } from "../services/organiserService";

const organiserRepository=new OrganiserRepository();
const organiserService=new OrganiserService(organiserRepository);
export const organiserController=new OrganiserController(organiserService)
