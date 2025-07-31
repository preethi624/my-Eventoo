import { IAdminUserService } from "src/services/serviceInterface/IAdminUserService";
import { IAdminUserController } from "./controllerInterface/IAdminUserController";
import { Request, Response } from "express";
import { EditUser, IUser, IUserDTO } from "src/interface/IUserAuth";
import { StatusCode } from "../constants/statusCodeEnum";
import { mapUserToDTO } from "../utils/mapUserToDTO";
import { userSocketMap } from "../socketMap";
import {io} from '../index'
import { MESSAGES } from "../constants/messages";


export class AdminUserController implements IAdminUserController{
    constructor(private adminUserService:IAdminUserService){}
    async getAllUsers(req:Request,res:Response):Promise<void>{
  try {
     const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1; 

    const result=await this.adminUserService.getUsers(limit,page);
   
    
  if(result.success&&result.result){
    const mappedUsers: IUserDTO[] = result.result.map(mapUserToDTO);
 
    res.json({result:mappedUsers,message:result.message,success:true,total:result.total})
  }else{
    res.json({message:result.message,success:false})

  } 

    
  } catch (error) {
    console.log(error);
    

     res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.COMMON.SERVER_ERROR }); 
  }


}

async updateUser(req: Request<{id:string}, unknown,EditUser>,  res: Response):Promise<void>{
  try {
    const id=req.params.id;
    const formData=req.body;
    const result=await this.adminUserService.userUpdate(id,formData);
    if(result.success){
      res.json({success:true,message:"edited successfully"})
      return
    }else{
      res.json({success:false,message:"failed to edit"})
    }
    
  } catch (error) {
    console.log(error);
    
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message:MESSAGES.COMMON.SERVER_ERROR }); 
    
  }
  

}
async blockUser(req: Request<unknown, unknown,IUser>,  res: Response):Promise<void>{
  try {
  
    const user=req.body;
    const userId=user._id
    const result=await this.adminUserService.userBlock(user);
    
    if(result.success&&result.user){
   
     
      if(result.user.isBlocked){
        const socketId=userSocketMap.get(userId.toString())
        if (socketId) {
            io.to(socketId).emit('logout');
            console.log(`Forced logout emitted for user ${userId}`);
          }
      }
      
    
    
      
      res.json({success:true,message:"User blocked successfully"})
    }else{
      res.json({success:false,message:"failed to block"})
    }

    
  } catch (error) {
    console.log(error);
    
    
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.COMMON.SERVER_ERROR }); 
 
  

}
  
}
async getDashboardUsers(req:Request,res:Response):Promise<void>{
  try {
    const result=await this.adminUserService.dashboardUsers();
  if(result.success){
    
 
    res.json({data:result.data,message:result.message,success:true,totalUsers:result.totalUsers})
  }else{
    res.json({message:result.message,success:false})

  } 

    
  } catch (error) {
    console.log(error);
    

     res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.COMMON.SERVER_ERROR }); 
  }


}

}