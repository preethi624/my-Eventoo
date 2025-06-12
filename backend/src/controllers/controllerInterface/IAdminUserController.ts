import { Request, Response } from "express";
import { EditUser, IUser } from "src/interface/IUserAuth";
export interface IAdminUserController{
    getAllUsers(req:Request,res:Response):Promise<void>;
    updateUser(req: Request<{id:string}, unknown,EditUser>,  res: Response):Promise<void>;
    blockUser(req: Request<unknown, unknown,IUser>,  res: Response):Promise<void>
}