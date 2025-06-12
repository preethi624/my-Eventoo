import { Forgot, LoginBody, RegisterResult, Resend } from "src/interface/IUserAuth";
import { IAuthController } from "./controllerInterface/IAuthController";
import { Request, Response } from "express";
import { IAuthService } from "src/services/serviceInterface/IAuthService";
import { StatusCode } from "../constants/statusCodeEnum";


export class AuthController implements IAuthController{
  constructor(private authService:IAuthService){}
     async forgotPassword(req: Request<unknown, unknown, Resend>, res: Response):Promise<void>{
    try {
     
      
      const {email,userType}=req.body;
    const result:RegisterResult=await this.authService.passwordForgot({email,userType});
    if(!result.success){

      res.status(StatusCode.UNAUTHORIZED).json({ message: result.message,success:false });
      return
   }
   res.status(StatusCode.OK).json({message:result.message,success:true})
      
    } catch (error) {
      console.log(error);
      
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error",success:false });
      
    }
    


  }
async otpVerify(req: Request<unknown, unknown, Forgot>, res: Response):Promise<void>{
    try {
      const {email,otp,userType}=req.body;
    const result:RegisterResult=await this.authService.verifyOtp({email,otp,userType});
    if(!result.success){

      res.status(StatusCode.UNAUTHORIZED).json({ message: result.message,success:false });
      return
   }
   res.status(StatusCode.OK).json({message:result.message,success:true})
      
      
    } catch (error) {
      console.log(error);
      

        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error",success:false });
      
      
    }

    

  }
   async passwordReset(req: Request<unknown, unknown, LoginBody>, res: Response):Promise<void>{
    try {
      const {email,password,userType}=req.body;
    const result:RegisterResult=await this.authService.resetPassword({email,password,userType});
    if(!result.success){

      res.status(StatusCode.UNAUTHORIZED).json({ message: result.message,success:false });
      return
   }
   res.status(StatusCode.OK).json({message:result.message,success:true})
      
      
    } catch (error) {
      console.log(error);
      
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error",success:false });
      
      
    }

  }

   async resendForgot(req: Request<unknown, unknown, Resend>, res: Response):Promise<void>{
    try {
      const {email,userType}=req.body;
     
      

      const result:RegisterResult=await this.authService.forgotResend({email,userType});
    
      
      if(!result.success){

        res.status(StatusCode.UNAUTHORIZED).json({ message: result.message,success:false });
        return
     }
     res.status(StatusCode.OK).json({message:result.message,success:true})
     
      
    } catch (error) {
      console.error(error)
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error",success:false }); 
      
    } 

  
  }
  
  
}