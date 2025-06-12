import { Request, Response } from "express";
import { Forgot, LoginBody, Resend } from "src/interface/IUserAuth";
export interface IAuthController{
    forgotPassword(req: Request<unknown, unknown, Resend>, res: Response):Promise<void>;
   otpVerify(req: Request<unknown, unknown, Forgot>, res: Response):Promise<void> ;
   passwordReset(req: Request<unknown, unknown, LoginBody>, res: Response):Promise<void>;

 

    
}