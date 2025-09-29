import { Request, Response } from "express";
import { ProfileEdit } from "src/interface/IUser";
export interface IUserController{
    getUser(req:Request,res:Response):Promise<void>;
    updateUser(req:Request<unknown,unknown,ProfileEdit>,res:Response):Promise<void>;
<<<<<<< HEAD
    getOrgs(req:Request,res:Response):Promise<void>;
    changePassword(req:Request,res:Response):Promise<void>
=======
    getOrgs(req:Request,res:Response):Promise<void>
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
}