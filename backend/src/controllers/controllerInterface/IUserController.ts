import { Request, Response } from "express";
import { ProfileEdit } from "src/interface/IUser";
export interface IUserController{
    getUser(req:Request,res:Response):Promise<void>;
    updateUser(req:Request<unknown,unknown,ProfileEdit>,res:Response):Promise<void>;
}