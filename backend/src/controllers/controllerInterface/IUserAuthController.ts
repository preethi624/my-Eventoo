import { Request, Response,NextFunction } from "express";
import { RegisterBody, VerifyBody } from "../../interface/IUserAuth";

export interface IUserAuthController {
  userLogin(req: Request, res: Response): Promise<void>;

 userRegister(req:Request<unknown,unknown,RegisterBody>,res:Response):Promise<void>;
  userVerify(req:Request<unknown,unknown,VerifyBody>,res:Response):Promise<void>;
   handleRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

}