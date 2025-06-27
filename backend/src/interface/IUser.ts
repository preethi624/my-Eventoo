import { IUser } from "./IUserAuth";

export interface UserGet{
    user?:IUser;
    success:boolean;
    message:string
}
export interface ProfileEdit{
  name?:string;
  email?:string;
  phone?:number;
  location?:string;
  aboutMe?:string;
  profileImage?:string;
}
export interface EditResult{
    success:boolean;
    message:string;
    result?:IUser
}
export interface EditOrganiserResult{
  success:boolean;
    message:string;
    result?:IUser

}
export interface Reapply{
  success:boolean;
  message:string;
}
