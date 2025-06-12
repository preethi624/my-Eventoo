
import { IOrganiser } from "src/interface/IOrgAuth";
import { IOtp } from "../../interface/IOtp";
import { IUser } from "../../interface/IUserAuth";


export interface ICommonAuthRepository{
    findByEmail(email:string):Promise<IUser|IOrganiser|null>;
    createOTP(otp:string,email:string):Promise<void>;
    findOtp(email:string):Promise<IOtp|null>;
    updateAccount(email:string,password:string):Promise<void>;

   


    
}