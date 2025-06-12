import { LoginBody } from "src/interface/IUserAuth";
import { Request, Response } from "express";

export interface IAdminAuthController{
   adminLogin(req: Request<unknown, unknown, LoginBody>, res: Response):Promise<void>

}