import { DashboardUsers, GetUser } from "src/interface/IUser";
import { EditUser, IUser } from "src/interface/IUserAuth";

export interface IAdminUserRepository {
  getUserAll(limit: number, page: number,searchTerm:string,filterStatus:string,sortBy:string): Promise<GetUser>;
  editUser(id: string, formData: EditUser): Promise<IUser | null>;
  blockUser(user: IUser): Promise<IUser | null>;
  getDashboardUsers(): Promise<DashboardUsers>;
}
