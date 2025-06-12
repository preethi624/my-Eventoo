import { LoginResult, RegisterResult, Resend, VerifyInput } from "../../interface/IUserAuth";

export interface IUserAuthService{
    loginUser(email:string,password:string):Promise<LoginResult>;
    registerUser(name:string,email:string,password:string):Promise<RegisterResult>;
    userVerify({name,email,password,otp}:VerifyInput):Promise<RegisterResult>;
    resendUser({email}:Resend):Promise<RegisterResult>
     loginUserWithGoogle (credential:string): Promise<RegisterResult>;
     refreshTokens(
    refreshToken: string
  ): Promise<{ accessToken: string | null }>
    
    

}