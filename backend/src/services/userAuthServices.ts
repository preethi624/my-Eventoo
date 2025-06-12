import { IUser, LoginResult, RegisterResult, Resend, VerifyInput } from "../interface/IUserAuth";
import { IUserAuthRepository } from "../repositories/repositoryInterface/IUserAuthRepository";
import { IMailService } from "./serviceInterface/IMailService";
import { IOTPService } from "./serviceInterface/IOtpService";
import { IUserAuthService } from "./serviceInterface/IUserAuthService";

import { ITokenService } from "./serviceInterface/ITokenService";
import { IPasswordService } from "./serviceInterface/IPasswordService";
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

import { JwtPayload } from "jsonwebtoken";

dotenv.config();



const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export class UserAuthService implements IUserAuthService{
    constructor(private authRepository:IUserAuthRepository,private otpService:IOTPService,private mailService:IMailService,private tokenService:ITokenService,private passwordService:IPasswordService){}
    async loginUser(email: string, password: string): Promise<LoginResult> {
        const user:IUser|null=await this.authRepository.findUserByEmail(email);
        if(!user) return {success:false,message:"User not found"};
        const isMatch=await this.passwordService.comparePassword(password, user.password);
        if(!isMatch) return {success:false,message:"password not matching"};
        if(user.isBlocked){
            return {success:false,message:"Your account has been blocked.Please contact support"}
        }
        const payload = { id: user._id, role: "user", email: user.email };
        const accessToken=this.tokenService.generateAccessToken(payload);
        const refreshToken=this.tokenService.generateRefreshToken(payload)

       
     return {
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
    };

    }
    async registerUser(name:string,email:string):Promise<RegisterResult>{
     
  try {
    
    
    const existingUser = await this.authRepository.findUserByEmail(email);

    if (existingUser) return { success: false, message: "User already exists" };

    const otp = this.otpService.generateOTP();
    await this.authRepository.createOTP(otp, email); 

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}\nThis OTP will expire in 10 minutes.`
    };

    await this.mailService.sendMail(mailOptions);

    return { success: true, message: "OTP sent to your email" };

} catch (error) {
    console.error("Error in registerUser:", error);
    return { success: false, message: "Internal server error" };
}
  

}
async userVerify({name,email,password,otp}:VerifyInput):Promise<RegisterResult>{
  try {
   
    
    const OTP=await this.authRepository.findOtpByEmail(email);
    
    
    if (!OTP) {
      return { success: false, message: "OTP not found, please try again" };
    }
    if(OTP.otp!=otp){
      return{success:false,message:"otp verification failed,please try again"}
  
    }
    const hashedPassword= await this.passwordService.hashPassword(password);
           await this.authRepository.createUser({name,email,password:hashedPassword});
    
    return {success:true,message:"User registered successfully"}
  
    
  } catch (error) {
    console.error("Error in otpVerification:", error);
    return { success: false, message: "Internal server error" };
    
  }
 

}
async resendUser({email}:Resend):Promise<RegisterResult>{
  try {
    const otp = this.otpService.generateOTP();
    
    
    await this.authRepository.createOTP(otp, email); 

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}\nThis OTP will expire in 10 minutes.`
    };

    await this.mailService.sendMail(mailOptions);

    return({success:true,message:"otp send successfully"})
    
  } catch (error) {
    console.log(error);
    
   
    return { success: false, message: "Internal server error" };

    
  }


}
async loginUserWithGoogle (credential:string): Promise<RegisterResult> {
  try {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (!googleClientId) throw new Error("Missing GOOGLE_CLIENT_ID in environment variables");

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: googleClientId,
    });

    const jwtkey = process.env.JWT_KEY;
    if (!jwtkey) throw new Error("Missing JWT_KEY in environment variables");
    

    const payload = ticket.getPayload();
    if (!payload) throw new Error("Invalid token payload");
     

    const { email, name, picture, sub: googleId } = payload;
    if (!name || !email || !picture || !googleId) {
      throw new Error("Missing required user information from Google payload");
    }
    
    let user = await this.authRepository.findUserByEmail(email!);

    if (!user) {
      user = await this.authRepository.createUser({
        name,
        email,
        picture,
        googleId,
        authMethod:'google'
      });
    }
    if (user.isBlocked) {
      return { success: false, message: "Your account has been blocked. Please contact support." };
    }
   

  const {  exp,iat,...cleanPayload } = payload
    const accessToken=this.tokenService.generateAccessToken({...cleanPayload,role:'user',id:user._id});
        const refreshToken=this.tokenService.generateRefreshToken({...cleanPayload,role:'user',id:user._id})

    return { success: true, accessToken, refreshToken,message:"success" };
  } catch (error) {
    console.error("Error in loginUserWithGoogle:", error);
    return { success: false, message: "Google authentication failed" };
  }
};
async refreshTokens(
    refreshToken: string
  ): Promise<{ accessToken: string | null }>  {
    try {
      
       const decoded=this.tokenService.verifyRefreshToken(refreshToken)
  
      
      if (typeof decoded === "string" || !decoded || typeof decoded !== 'object') {
    
      throw new Error("Invalid token payload");
    }
     const payload = {
      id: (decoded as JwtPayload).id,
      role: (decoded as JwtPayload).role,
      email: (decoded as JwtPayload).email
    };
      const newAccessToken=this.tokenService.generateAccessToken(payload)
  
      return { accessToken: newAccessToken };
    } catch (error) {
      console.error('Token refresh error:', error);
      return { accessToken: null }; 
    }
  };


    
}