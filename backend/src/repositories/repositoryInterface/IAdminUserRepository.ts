import { DashboardUsers, GetUser } from "src/interface/IUser";
import { EditUser, IUser } from "src/interface/IUserAuth";

export interface IAdminUserRepository {
<<<<<<< HEAD
  getUserAll(limit: number, page: number,searchTerm:string,filterStatus:string,sortBy:string): Promise<GetUser>;
=======
  getUserAll(limit: number, page: number,searchTerm:string,filterStatus:string): Promise<GetUser>;
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
  editUser(id: string, formData: EditUser): Promise<IUser | null>;
  blockUser(user: IUser): Promise<IUser | null>;
  getDashboardUsers(): Promise<DashboardUsers>;
}
