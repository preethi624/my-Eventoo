import { Request, Response } from "express";
import { IUserController } from "./controllerInterface/IUserController";
import { IUserService } from "src/services/serviceInterface/IUserService";
import { ProfileEdit } from "src/interface/IUser";
export class UserController implements IUserController{
    constructor(private userService:IUserService){}
    async getUser(req:Request,res:Response):Promise<void>{
        try {
             const userId=req.params.userId;
        const response=await this.userService.userGet(userId);
        console.log("respo",response);
        
        if(response){
            res.json({user:response,success:true,message:"fetched user successfully"})
        }else{
            res.json({success:false,message:"failed to fetch user"})
        }
            
        } catch (error) {
            console.log(error);
            
            
        }
       

    }
async updateUser(req:Request<{userId:string},unknown,ProfileEdit>,res:Response):Promise<void>{
    try {
           const { name, email, phone, location, aboutMe } = req.body;
        const userId=req.params.userId
        const image=req.file?.filename;
        console.log("image",image);
        
        const data = {
      name,
      email,
      phone,
      location,
      aboutMe,
      profileImage: image, 
    };
    const response=await this.userService.userUpdate(data,userId);
    if(response.success){
        res.json({result:response.result,success:true,message:"user updated "})
    }else{
        res.json({success:false,message:"failed to update"})
    }
        
    } catch (error) {
        console.log(error);
        
        
    }
    

}



}