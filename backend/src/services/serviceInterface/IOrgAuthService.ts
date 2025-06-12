import { LoginResult, RegisterResult, Resend, VerifyInput } from "../../interface/IUserAuth";

export interface IOrgAuthService{
    loginOrganiser(email:string,password:string):Promise<LoginResult>;
    registerOrganiser(name:string,email:string,password:string):Promise<RegisterResult>;
    organiserVerify({name,email,password,otp}:VerifyInput):Promise<RegisterResult>;
    resendOrganiser({email}:Resend):Promise<RegisterResult>;
    loginOrganiserWithGoogle (credential:string): Promise<RegisterResult>
    
    

}