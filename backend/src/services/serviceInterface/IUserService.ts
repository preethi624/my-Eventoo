import { EditResult, ProfileEdit, UserGet } from "src/interface/IUser";

export interface IUserService{
     userGet(userId:string):Promise<UserGet>;
    userUpdate(data:ProfileEdit,userId:string):Promise<EditResult>
}