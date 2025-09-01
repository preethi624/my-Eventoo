import { DashboardUsers } from "src/interface/IUser";
import { EditUser, GetUsers, IUser } from "src/interface/IUserAuth";

export interface IAdminUserService {
  getUsers(limit: number, page: number,searchTerm:string,filterStatus:string,sortBy:string): Promise<GetUsers>;
  userUpdate(id: string, formData: EditUser): Promise<GetUsers>;
  userBlock(user: IUser): Promise<GetUsers>;
  dashboardUsers(): Promise<DashboardUsers>;
}
