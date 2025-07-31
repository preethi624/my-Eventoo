import { DashboardUsers, GetUser } from "src/interface/IUser";
import { EditUser, IUser } from "../interface/IUserAuth";
import User from "../model/user";


import { IAdminUserRepository } from "./repositoryInterface/IAdminUserRepository";



export class AdminUserRepository implements IAdminUserRepository{
    async getUserAll(limit:number,page:number):Promise<GetUser>{
        const skip=(page-1)*limit
    const users= await User.find().skip(skip).limit(limit).lean();
    const totalUser=await User.countDocuments();
    const total=totalUser/limit;

    return {users,total}
    }
     async editUser(id:string,formData:EditUser):Promise<IUser|null>{
        return await User.findByIdAndUpdate(id,formData,{new:true})

    }
    async blockUser(user:IUser):Promise<IUser|null>{
      
        
        const id=user._id
        if(!user.isBlocked){

            return await User.findByIdAndUpdate(id,{isBlocked:true},{new:true})
        }else{
            return await User.findByIdAndUpdate(id,{isBlocked:false},{new:true})

        }
        

    }
    async getDashboardUsers():Promise<DashboardUsers>{
        

        const data=await User.aggregate([
            {$group:{_id:{$month:"$createdAt"},totalUsers:{$sum:1}}},
            {$project:{month:"$_id",totalUsers:1,_id:0}},
            {$sort:{month:1}}

        ])
        const totalUsers=await User.find({isBlocked:false})
        
        
        return {data,totalUsers:totalUsers.length}
    }
}