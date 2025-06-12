import { AdminUserController } from "../controllers/adminUserController";
import { AdminUserRepository } from "../repositories/adminUserRepository";
import { AdminUserService } from "../services/adminUserService";

const adminRepository=new AdminUserRepository();



const adminService=new AdminUserService(adminRepository);
export const adminController=new AdminUserController(adminService)
