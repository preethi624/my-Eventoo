import { MailService } from "../services/mailService";
import { AdminOrgController } from "../controllers/adminOrgController";
import { AdminOrgRepository } from "../repositories/adminOrgRepository";

import { AdminOrgService } from "../services/AdminOrgService";

const adminOrgRepository=new AdminOrgRepository();
const mailService=new MailService()



const adminOrgService=new AdminOrgService(adminOrgRepository,mailService);
export const adminOrgController=new AdminOrgController(adminOrgService)
