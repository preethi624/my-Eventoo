import { Forgot, LoginBody, RegisterResult, Resend} from "src/interface/IUserAuth"

export interface IAuthService{
    passwordForgot({email,userType}:Resend):Promise<RegisterResult>;
    verifyOtp({email,otp}:Forgot):Promise<RegisterResult>;
    resetPassword({email,password,userType}:LoginBody):Promise<RegisterResult>;

    forgotResend({email}:Resend):Promise<RegisterResult>

   

}