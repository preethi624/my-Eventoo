import { EditResult, ProfileEdit, UserGet } from "src/interface/IUser";

import { IUserService } from "./serviceInterface/IUserService";
import { IUserRepository } from "src/repositories/repositoryInterface/IUserRepository";

export class UserService implements IUserService{
    constructor(private userRepository:IUserRepository){}
    async userGet(userId:string):Promise<UserGet>{
        try {
             const result=await this.userRepository.getUser(userId);
            
             
        if(result){
            return {user:result,success:true,message:"fetched success"}
        }else{
            return{success:false,message:"failed to fetch"}
        }
            
        } catch (error) {
            console.log(error);
            return {success:false,message:"failed to fetch"}
            
            
        }
       

    }
    async userUpdate(data:ProfileEdit,userId:string):Promise<EditResult>{
        try {
            const result=await this.userRepository.updateUser(data,userId);
            console.log("resu;lt",result);
            
        if(result){
            return {result:result,success:true,message:"user updated successfully"}
        }else{
            return {success:false,message:"failed to update"}
        }
            
        } catch (error) {

           console.log(error);
            return {success:false,message:"failed to update"}  
        }
        

    }
}