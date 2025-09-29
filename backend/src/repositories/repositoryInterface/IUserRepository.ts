import { IOrganiser } from "src/interface/IOrgAuth";
import { ProfileEdit } from "src/interface/IUser";
import { IUser } from "src/interface/IUserAuth";

export interface IUserRepository{
    getUser(userId:string):Promise<IUser|null>;
    updateUser(data:ProfileEdit,userId:string):Promise<IUser|null>;
<<<<<<< HEAD
     getOrgs():Promise<IOrganiser[]>;
      changePassword(userId:string,newPass:string,currentPass:string):Promise<{success:boolean}|undefined>
=======
     getOrgs():Promise<IOrganiser[]>
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
}