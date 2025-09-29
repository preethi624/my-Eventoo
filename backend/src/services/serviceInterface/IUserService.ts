import { EditResult, GetOrgs, ProfileEdit, UserGet } from "src/interface/IUser";

export interface IUserService{
     userGet(userId:string):Promise<UserGet>;
    userUpdate(data:ProfileEdit,userId:string):Promise<EditResult>;
<<<<<<< HEAD
    orgsGet():Promise<GetOrgs>;
    passwordChange(userId:string,newPass:string,currentPass:string):Promise<{success:boolean}>
=======
    orgsGet():Promise<GetOrgs>
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
}