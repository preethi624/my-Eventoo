import { IUser } from "src/interface/IUserAuth";
import User from "../model/user";
import { IUserRepository } from "./repositoryInterface/IUserRepository";
import { ProfileEdit } from "src/interface/IUser";
import { IOrganiser } from "src/interface/IOrgAuth";
import Organiser from "../model/organiser";

export class UserRepository implements IUserRepository {
  async getUser(userId: string): Promise<IUser | null> {
    return await User.findById(userId);
  }
  async updateUser(data: ProfileEdit, userId: string): Promise<IUser | null> {
    const { name, email, phone, location, aboutMe, profileImage } = data;
    return await User.findByIdAndUpdate(
      userId,
      { name, phone, location, aboutMe: aboutMe, profileImage },
      { new: true }
    );
  }
  async getOrgs(): Promise<IOrganiser[]> {
    try {
      return await Organiser.find();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
