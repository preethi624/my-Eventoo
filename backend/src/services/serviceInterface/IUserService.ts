import { EditResult, GetOrgs, ProfileEdit, UserGet } from "src/interface/IUser";

export interface IUserService{
     userGet(userId:string):Promise<UserGet>;
    userUpdate(data:ProfileEdit,userId:string):Promise<EditResult>;
    orgsGet():Promise<GetOrgs>;
    passwordChange(userId:string,newPass:string,currentPass:string):Promise<{success:boolean}>
}