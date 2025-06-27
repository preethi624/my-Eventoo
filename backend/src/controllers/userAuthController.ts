import { CredentialResponse, LoginBody, LoginResult, RegisterBody, RegisterResult, Resend, VerifyBody } from "../interface/IUserAuth";
import { IUserAuthService } from "../services/serviceInterface/IUserAuthService";
import { Request, Response } from "express";
import { IUserAuthController } from "./controllerInterface/IUserAuthController";
import { ISetTokenService } from "../services/serviceInterface/ISetTokenService";
import { StatusCode } from "../constants/statusCodeEnum";
import { MESSAGES } from "../constants/messages";

export class UserAuthController implements IUserAuthController{
   constructor(private authService:IUserAuthService,private setTokenService:ISetTokenService){};
   async userLogin (req: Request<unknown, unknown, LoginBody>, res: Response):Promise<void> {
    try {
      const {email,password}=req.body
      const result:LoginResult=await this.authService.loginUser(email,password);
      
      
      if (!result.success) {
      
        
         res.status(401).json({ message: result.message });
         return

      }
      if (result.refreshToken) {
      
      this.setTokenService.setRefreshToken(res,result.refreshToken)


    }
  
       res.json(result);
  
      
      
    } catch (error) {
      console.log(error);
      
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.COMMON.SERVER_ERROR}); 
      
    }
   
  };
  
   async userRegister(req:Request<unknown,unknown,RegisterBody>,res:Response):Promise<void>{
    try {
     
      
      const {name,email,password}=req.body;
      const result:RegisterResult=await this.authService.registerUser(name,email,password)
     
      
      if(!result.success){
        
        res.status(StatusCode.UNAUTHORIZED).json({ message: result.message,success:false });
        
        
        return

      }
     
      
      res.status(StatusCode.CREATED).json({message:result.message,success:true})
      
    } catch (error) {
      console.log(error);
      
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.COMMON.SERVER_ERROR,success:false }); 
      
    }

  }
  async userVerify(req:Request<unknown,unknown,VerifyBody>,res:Response):Promise<void>{
  try {
    
    

      const {name,email,password,otp}=req.body

      const result:RegisterResult=await this.authService.userVerify({name,email,password,otp});
      if(!result.success){

         res.status(StatusCode.UNAUTHORIZED).json({ message: result.message,success:false });
         return
      }
      res.status(StatusCode.OK).json({message:result.message,success:true})
      
    } catch (error) {
      console.log(error);
      

      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message:MESSAGES.COMMON.SERVER_ERROR,success:false }); 
    }
    
  }
  async userResend(req: Request<unknown, unknown, Resend>, res: Response):Promise<void>{
    try {
      const {email}=req.body;
     
      

      const result:RegisterResult=await this.authService.resendUser({email});
    
      
      if(!result.success){

        res.status(StatusCode.UNAUTHORIZED).json({ message: result.message,success:false });
        return
     }
     res.status(StatusCode.OK).json({message:result.message,success:true})
     
      
    } catch (error) {
      console.error(error)
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.COMMON.SERVER_ERROR,success:false }); 
      
    }
  }

  async googleUserLogin(req: Request<unknown, unknown, CredentialResponse>, res: Response):Promise<void>{
    try {
      const {credential}=req.body;
     
      
      const result:RegisterResult=await this.authService. loginUserWithGoogle(credential)
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
    
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.COMMON.SERVER_ERROR });
      
  }
  }
  async handleRefreshToken(
  req: Request,
  res: Response,
 
): Promise<void>  {
  try {
   
    
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      res.status(StatusCode.UNAUTHORIZED).json({ message: 'No refresh token provided' });
      return;
    }

    const newToken = await this.authService.refreshTokens(refreshToken);

    if (!newToken?.accessToken) {
      res.status(StatusCode.FORBIDDEN).json({ message: 'Invalid refresh token' });
      return;
    }

    res.json({ token: newToken.accessToken });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(StatusCode.FORBIDDEN).json({ message: 'Invalid refresh token' });
  }
};



}