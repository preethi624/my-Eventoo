import { DashboardUsers } from "src/interface/IUser";
import { EditUser, GetUsers, IUser } from "src/interface/IUserAuth";

export interface IAdminUserService {
<<<<<<< HEAD
  getUsers(limit: number, page: number,searchTerm:string,filterStatus:string,sortBy:string): Promise<GetUsers>;
=======
  getUsers(limit: number, page: number,searchTerm:string,filterStatus:string): Promise<GetUsers>;
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
  userUpdate(id: string, formData: EditUser): Promise<GetUsers>;
  userBlock(user: IUser): Promise<GetUsers>;
  dashboardUsers(): Promise<DashboardUsers>;
}
