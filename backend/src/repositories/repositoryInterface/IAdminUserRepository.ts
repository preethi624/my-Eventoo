import { EditUser, IUser } from "src/interface/IUserAuth";


export interface IAdminUserRepository{
    getUserAll():Promise<IUser[]>;
    editUser(id:string,formData:EditUser):Promise<IUser|null>;
    blockUser(user:IUser):Promise<IUser|null>;
    
}