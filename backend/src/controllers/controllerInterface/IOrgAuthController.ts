import { Request, Response } from "express";
import { RegisterBody, VerifyBody } from "../../interface/IUserAuth";

export interface IOrgAuthController {
  organiserLogin(req: Request, res: Response): Promise<void>;

 organiserRegister(req:Request<unknown,unknown,RegisterBody>,res:Response):Promise<void>;
  organiserVerify(req:Request<unknown,unknown,VerifyBody>,res:Response):Promise<void>;

}