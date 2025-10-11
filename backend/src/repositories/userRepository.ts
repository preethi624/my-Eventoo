import { IUser } from "src/interface/IUserAuth";
import User from "../model/user";
import { IUserRepository } from "./repositoryInterface/IUserRepository";
import { ProfileEdit } from "src/interface/IUser";
import { IOrganiser } from "src/interface/IOrgAuth";
import Organiser from "../model/organiser";
import bcrypt from "bcrypt";
import Venue, { IVenue } from "../model/venue";

export class UserRepository implements IUserRepository {
  async getUser(userId: string): Promise<IUser | null> {
    return await User.findById(userId);
  }
  async updateUser(data: ProfileEdit, userId: string): Promise<IUser | null> {
    const { name, phone, location, aboutMe, profileImage } = data;
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
  async changePassword(userId:string,newPass:string,currentPass:string):Promise<{success:boolean}|undefined>{
    try {
      console.log("new",newPass);
      
      const user=await User.findById(userId)
      if(!user){
        throw new Error("user not found")
      }
      const isMatch = await bcrypt.compare(currentPass, user.password);
       if (!isMatch) {
      return { success: false }; 
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPass, saltRounds);
     user.password = hashedPassword;
    await user.save();
    return {success:true}


      
    } catch (error) {
      console.log(error);
    return { success: false };
    }
  }
  async fetchVenues():Promise<IVenue[]>{
    return await Venue.find()
  }
}
