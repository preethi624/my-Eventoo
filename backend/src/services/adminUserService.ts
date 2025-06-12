import { EditUser, GetUsers, IUser } from "src/interface/IUserAuth";
import { IAdminUserService } from "./serviceInterface/IAdminUserService";
import { IAdminUserRepository } from "src/repositories/repositoryInterface/IAdminUserRepository";


export class AdminUserService implements IAdminUserService{
    constructor(private adminUserRepository:IAdminUserRepository){}
    async getUsers():Promise<GetUsers>{
  try {
    const result:IUser[]=await this.adminUserRepository.getUserAll();
    if(result){
      return {result:result,success:true,message:"Users fetched successfully"}
    }else{
      return{success:false,message:"failed to fetch users"}
    }
    
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Internal server error',
    };
    
  }

}
async userUpdate(id:string,formData:EditUser):Promise<GetUsers>{
  try {
    const response=await this.adminUserRepository.editUser(id,formData);
   
    
    if(response){
      

   
      return{success:true,message:"User edit successfully"}

    }else{
      return {success:false,message:"failed to edit organiser"}
    }
    
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Internal server error',
    };
    
  }


}
async userBlock(user:IUser):Promise<GetUsers>{
  try {
    const response=await this.adminUserRepository.blockUser(user);
    if(response){
      console.log("reseee",response);
      
      return {user:response,success:true,message:"User blocked successfully"}

    }else{
      return {success:false,message:"failed to block"}
    }
  } catch (error) {

    console.error('Login error:', error);
    return {
      success: false,
      message: 'Internal server error',
    };
  }


}



}