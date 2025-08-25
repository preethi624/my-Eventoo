import { EditResult, GetOrgs, ProfileEdit, UserGet } from "src/interface/IUser";

import { IUserService } from "./serviceInterface/IUserService";
import { IUserRepository } from "src/repositories/repositoryInterface/IUserRepository";

export class UserService implements IUserService {
  constructor(private _userRepository: IUserRepository) {}
  async userGet(userId: string): Promise<UserGet> {
    try {
      const result = await this._userRepository.getUser(userId);

      if (result) {
        return { user: result, success: true, message: "fetched success" };
      } else {
        return { success: false, message: "failed to fetch" };
      }
    } catch (error) {
      console.log(error);
      return { success: false, message: "failed to fetch" };
    }
  }
  async userUpdate(data: ProfileEdit, userId: string): Promise<EditResult> {
    try {
      const result = await this._userRepository.updateUser(data, userId);
      console.log("resu;lt", result);

      if (result) {
        return {
          result: result,
          success: true,
          message: "user updated successfully",
        };
      } else {
        return { success: false, message: "failed to update" };
      }
    } catch (error) {
      console.log(error);
      return { success: false, message: "failed to update" };
    }
  }
  async orgsGet(): Promise<GetOrgs> {
    try {
      const response = await this._userRepository.getOrgs();
      if (response) {
        return { organisers: response, success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async passwordChange(userId:string,newPass:string,currentPass:string):Promise<{success:boolean}>{
    try {
      const response=await this._userRepository.changePassword(userId,newPass,currentPass);
      if(response){
        return {success:true}
      }else{
        return {success:false}
      }
      
    } catch (error) {
      console.log(error);
      return {success:false}
      
      
    }

  }
}
