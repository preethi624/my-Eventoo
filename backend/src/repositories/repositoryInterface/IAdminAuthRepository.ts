import { IAdmin } from "src/interface/IAdmin";

export interface IAdminAuthRepository{
     findAdminByEmail(email:string):Promise<IAdmin|null>
}