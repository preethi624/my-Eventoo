import { IUser } from "src/interface/IUserAuth";
import User from "../model/user";
import { IUserRepository } from "./repositoryInterface/IUserRepository";
import {  ProfileEdit } from "src/interface/IUser";

export class UserRepository implements IUserRepository{
    async getUser(userId:string):Promise<IUser|null>{
    
        
       
             return await User.findById(userId);
             
            
        
            
            
            
        
       

    }
    async updateUser(data:ProfileEdit,userId:string):Promise<IUser|null>{
        const {name,email,phone,location,aboutMe,profileImage}=data
        return await User.findByIdAndUpdate(userId,
            {name,phone,location,aboutMe:aboutMe,profileImage},{new:true}


        )


    }
}