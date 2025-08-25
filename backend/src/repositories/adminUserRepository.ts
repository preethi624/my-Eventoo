import { DashboardUsers, GetUser } from "src/interface/IUser";
import { EditUser, IUser } from "../interface/IUserAuth";
import User from "../model/user";

import { IAdminUserRepository } from "./repositoryInterface/IAdminUserRepository";
import { FilterQuery } from "mongoose";
import Notification from "../model/notification";


export class AdminUserRepository implements IAdminUserRepository {
  async getUserAll(limit: number, page: number,searchTerm:string,filterStatus:string): Promise<GetUser> {
    const query:FilterQuery<IUser>={};
    if(searchTerm){
      query.$or=[
        {name:{$regex:searchTerm,$options:"i"}},
        {email:{$regex:searchTerm,$options:"i"}}
      ]
    }
    if(filterStatus==="blocked"){
      query.isBlocked=true
    }else if(filterStatus==="unblocked"){
      query.isBlocked=false
    }
    const skip = (page - 1) * limit;
    const users = await User.find(query).skip(skip).limit(limit).lean();
    const totalUser = await User.countDocuments();
    const total = totalUser / limit;

    return { users, total };
  }
  async editUser(id: string, formData: EditUser): Promise<IUser | null> {
    try {
       const user= await User.findByIdAndUpdate(id, formData, { new: true });
      await Notification.create({
            userId:id,
            type:"general",
            message:`Your Eventoo acount is edited by admin !`,
            isRead:false
             })
             return user
      
    } catch (error) {
      console.log(error);
      return null
      
      
    }
   
  }
  async blockUser(user: IUser): Promise<IUser | null> {
    const id = user._id;
    if (!user.isBlocked) {
      const user=await User.findByIdAndUpdate(
        id,
        { isBlocked: true },
        { new: true }
      );
      await Notification.create({
            userId:id,
            type:"general",
            message:`Your Eventoo acount is blocked by admin !`,
            isRead:false
             })
             return user
    } else {
      const user=await User.findByIdAndUpdate(
        id,
        { isBlocked: false },
        { new: true }
      );
      await Notification.create({
            userId:id,
            type:"general",
            message:`Your Eventoo acount is unblocked by admin !`,
            isRead:false
             })
             return user
    }
  }
  async getDashboardUsers(): Promise<DashboardUsers> {
    const data = await User.aggregate([
      { $group: { _id: { $month: "$createdAt" }, totalUsers: { $sum: 1 } } },
      { $project: { month: "$_id", totalUsers: 1, _id: 0 } },
      { $sort: { month: 1 } },
    ]);
    const totalUsers = await User.find({ isBlocked: false });

    return { data, totalUsers: totalUsers.length };
  }
}
