import { IOtp, IUser, RegisterInput } from "../../interface/IUserAuth";

export interface IUserAuthRepository{
    findUserByEmail(email:string):Promise<IUser|null>

    createUser(userData:RegisterInput):Promise<IUser>
    createOTP(otp:string,email:string):Promise<void>
    findOtpByEmail(email:string):Promise<IOtp|null>
}
