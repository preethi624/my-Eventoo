import { EditUser, GetUsers, IUser } from "src/interface/IUserAuth";
import { IAdminUserService } from "./serviceInterface/IAdminUserService";
import { IAdminUserRepository } from "src/repositories/repositoryInterface/IAdminUserRepository";
import { DashboardUsers } from "src/interface/IUser";
import { MESSAGES } from "../constants/messages";

export class AdminUserService implements IAdminUserService {
  constructor(private _adminUserRepository: IAdminUserRepository) {}
  async getUsers(limit: number, page: number,searchTerm:string,filterStatus:string,sortBy:string): Promise<GetUsers> {
    try {
      const result = await this._adminUserRepository.getUserAll(limit, page,searchTerm,filterStatus,sortBy);
      if (result) {
        return {
          result: result.users,
          success: true,
          message: "Users fetched successfully",
          total: result.total,
        };
      } else {
        return { success: false, message: "failed to fetch users" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: MESSAGES.COMMON.SERVER_ERROR,
      };
    }
  }
  async userUpdate(id: string, formData: EditUser): Promise<GetUsers> {
    try {
      const response = await this._adminUserRepository.editUser(id, formData);

      if (response) {
        return { success: true, message: "User edit successfully" };
      } else {
        return { success: false, message: "failed to edit organiser" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: MESSAGES.COMMON.SERVER_ERROR,
      };
    }
  }
  async userBlock(user: IUser): Promise<GetUsers> {
    try {
      const response = await this._adminUserRepository.blockUser(user);
      if (response) {
        console.log("reseee", response);

        return {
          user: response,
          success: true,
          message: "User blocked successfully",
        };
      } else {
        return { success: false, message: "failed to block" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: MESSAGES.COMMON.SERVER_ERROR,
      };
    }
  }
  async dashboardUsers(): Promise<DashboardUsers> {
    try {
      const response = await this._adminUserRepository.getDashboardUsers();
      if (response) {
        return {
          success: true,
          data: response.data,
          totalUsers: response.totalUsers,
        };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: MESSAGES.COMMON.SERVER_ERROR,
      };
    }
  }
}
