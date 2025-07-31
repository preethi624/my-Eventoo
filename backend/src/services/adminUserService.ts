import { EditUser, GetUsers, IUser } from "src/interface/IUserAuth";
import { IAdminUserService } from "./serviceInterface/IAdminUserService";
import { IAdminUserRepository } from "src/repositories/repositoryInterface/IAdminUserRepository";
import { DashboardUsers } from "src/interface/IUser";


export class AdminUserService implements IAdminUserService{
    constructor(private adminUserRepository:IAdminUserRepository){}
    async getUsers(limit:number,page:number):Promise<GetUsers>{

  try {
    const result=await this.adminUserRepository.getUserAll(limit,page);
    if(result){
      return {result:result.users,success:true,message:"Users fetched successfully",total:result.total}
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
async dashboardUsers():Promise<DashboardUsers>{
  try {
    const response=await this.adminUserRepository.getDashboardUsers();
    if(response){
      return{success:true,data:response.data,totalUsers:response.totalUsers}
    }else{
      return {success:false}
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