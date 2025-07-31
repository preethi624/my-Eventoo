import { MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeEnum";
import { CredentialResponse, LoginBody, LoginResult, RegisterBody, RegisterResult, Resend, VerifyBody } from "../interface/IUserAuth";
import { IOrgAuthService } from "../services/serviceInterface/IOrgAuthService";
import { ISetTokenService } from "../services/serviceInterface/ISetTokenService";
import { IOrgAuthController } from "./controllerInterface/IOrgAuthController";
import { Request, Response } from "express";

export class OrgAuthController implements IOrgAuthController{
   constructor(private authService:IOrgAuthService,private setTokenService:ISetTokenService){};
   async organiserLogin (req: Request<unknown, unknown, LoginBody>, res: Response):Promise<void> {
    try {
      const {email,password}=req.body
      const result:LoginResult=await this.authService.loginOrganiser(email,password);
      
      
      if (!result.success) {
      
        
         res.status(StatusCode.UNAUTHORIZED).json({ message: result.message });
         return

      }
      if (result.refreshToken) {
      
       this.setTokenService.setRefreshToken(res,result.refreshToken)

    }
  
       res.json(result);
  
      
      
    } catch (error) {
      console.log(error);
      
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.COMMON.SERVER_ERROR }); 
      
    }
   
  };
  
   async organiserRegister(req:Request<unknown,unknown,RegisterBody>,res:Response):Promise<void>{
    try {
     
      
      const {name,email,password}=req.body;
      const result:RegisterResult=await this.authService.registerOrganiser(name,email,password)
     
      
      if(!result.success){
        
        res.status(StatusCode.UNAUTHORIZED).json({ message: result.message,success:false });
        
        
        return

      }
     
      
      res.status(StatusCode.CREATED).json({message:result.message,success:true})
      
    } catch (error) {
      console.log(error);
      
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error",success:false }); 
      
    }

  } 
  async organiserVerify(req:Request<unknown,unknown,VerifyBody>,res:Response):Promise<void>{
    try {
        const {name,email,password,otp}=req.body
        const result:RegisterResult=await this.authService.organiserVerify({name,email,password,otp});
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
    async organiserResend(req: Request<unknown, unknown, Resend>, res: Response):Promise<void>{
      try {
        const {email}=req.body;
       
        
  
        const result:RegisterResult=await this.authService.resendOrganiser({email});
      
        
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

   async googleOrganiserLogin(req: Request<unknown, unknown, CredentialResponse>, res: Response):Promise<void>{
      try {
        const {credential}=req.body;
       
        
        const result:RegisterResult=await this.authService. loginOrganiserWithGoogle(credential)
        if(!result.success){
            res.status(StatusCode.BAD_REQUEST).json({message:result.message})
            return
        }
        
        
       
        if (result.refreshToken) {
     
       this.setTokenService.setRefreshToken(res,result.refreshToken)

    }
        
        res.json({token:result.accessToken}) 
        
    } catch (error) {
      console.log(error);
      
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
        
    }
    }
  
  }


