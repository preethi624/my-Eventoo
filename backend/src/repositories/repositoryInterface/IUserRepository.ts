import { IOrganiser } from "src/interface/IOrgAuth";
import { ProfileEdit } from "src/interface/IUser";
import { IUser } from "src/interface/IUserAuth";

export interface IUserRepository{
    getUser(userId:string):Promise<IUser|null>;
    updateUser(data:ProfileEdit,userId:string):Promise<IUser|null>;
     getOrgs():Promise<IOrganiser[]>
}