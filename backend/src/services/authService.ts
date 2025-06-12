import { Forgot, LoginBody, RegisterResult, Resend} from "src/interface/IUserAuth";
import { IAuthService } from "./serviceInterface/IAuthService";
import { IOTPService } from "./serviceInterface/IOtpService";
import { IMailService } from "./serviceInterface/IMailService";
import { IPasswordService } from "./serviceInterface/IPasswordService";
import { CommonAuthRepository } from "../repositories/commonAuthRepository";
import { ICommonAuthRepository } from "src/repositories/repositoryInterface/ICommonAuthRepository";

export class AuthService implements IAuthService{
     constructor(private  otpService:IOTPService,private emailService:IMailService,private passwordService:IPasswordService){}

    async passwordForgot({email,userType}:Resend):Promise<RegisterResult>{
      try {
         if (userType !== 'user' && userType !== 'organiser') {
  throw new Error("Invalid user type");
}
      const repo:ICommonAuthRepository=CommonAuthRepository.getRepository(userType);
      const account=await repo.findByEmail(email);
      if (!account) {
      return { success: false, message: "Email not exist" };
    }
    const otp=this.otpService.generateOTP();
    await repo.createOTP(otp,email);
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}\nThis OTP will expire in 10 minutes.`
    };
    await this.emailService.sendMail(mailOptions);

      return { success: true, message: "OTP sent successfully" };
    
 
        
      } catch (error) {
        console.log(error);
    
    return { success: false, message: "Internal server error" };
        
      }
    
       
    }
    async verifyOtp({email,otp,userType}:Forgot):Promise<RegisterResult>{
  try {
    if (userType !== 'user' && userType !== 'organiser') {
  throw new Error("Invalid user type");
}
      const repo:ICommonAuthRepository=CommonAuthRepository.getRepository(userType);
      const Otp= await repo.findOtp(email)
    
    
    if (!Otp) {
      return { success: false, message: "OTP not found, please try again" };
    }
    if(otp!=Otp.otp){

  return{success:false,message:"otp verification failed,please try again"}



    }
    return {success:true,message:"otp verified successfully"}
    
  } catch (error) {
    console.log(error);
    
    return { success: false, message: "Internal server error" };

  }

}
async resetPassword({email,password,userType}:LoginBody):Promise<RegisterResult>{
  try {
    const hashedPassword=await this.passwordService.hashPassword(password)
   
   if (userType !== 'user' && userType !== 'organiser') {
  throw new Error("Invalid user type");
}
   const repo:ICommonAuthRepository=CommonAuthRepository.getRepository(userType);
   const account=repo.findByEmail(email);
    if(!account){
        return {success:false,message:"user not found"}
      }
      await repo.updateAccount(email,hashedPassword);
       return {success:true,message:"password updated successfully"}

    
    
  } catch (error ) {
    console.log(error);
    
    return { success: false, message: "Internal server error" };
    
  }

}
async forgotResend({email,userType}:Resend):Promise<RegisterResult>{
  try { 
    const otp = this.otpService.generateOTP();
     if (userType !== 'user' && userType !== 'organiser') {
  throw new Error("Invalid user type");
}
    const repo:ICommonAuthRepository=CommonAuthRepository.getRepository(userType);
    
    
    await repo.createOTP(email,otp); 

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}\nThis OTP will expire in 10 minutes.`
    };

    await this.emailService.sendMail(mailOptions);

    return({success:true,message:"otp send successfully"})
    
  } catch (error) {
    console.log(error);
    
   
    return { success: false, message: "Internal server error" };

    
  }


}

    
}