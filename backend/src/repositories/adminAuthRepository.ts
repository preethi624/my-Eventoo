import { IAdmin } from "../interface/IAdmin";
import Admin from "../model/admin";
import { IAdminAuthRepository } from "./repositoryInterface/IAdminAuthRepository";

export class AdminAuthRepository implements IAdminAuthRepository{
      async findAdminByEmail(email:string):Promise<IAdmin|null>{
        return await Admin.findOne({email})


    }
    
}