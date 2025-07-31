import { Request, Response } from "express";
import { IUserController } from "./controllerInterface/IUserController";
import { IUserService } from "src/services/serviceInterface/IUserService";
import { ProfileEdit } from "src/interface/IUser";
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}
export class UserController implements IUserController {
  constructor(private userService: IUserService) {}
  async getUser(req:AuthenticatedRequest, res: Response): Promise<void> {
    try {
     
      const userId=req.user?.id
      if(!userId){
        throw new Error("userId not get")
      }
     
      const response = await this.userService.userGet(userId);
    

      if (response) {
        res.json({
          user: response,
          success: true,
          message: "fetched user successfully",
        });
      } else {
        res.json({ success: false, message: "failed to fetch user" });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async updateUser(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { name, email, phone, location, aboutMe } = req.body;
      const userId = req.user?.id;
      const image = req.file?.filename;
      console.log("image", image);

      const data = {
        name,
        email,
        phone,
        location,
        aboutMe,
        profileImage: image,
      };
      if(!userId){
        throw new Error("userId not get")
      }
      const response = await this.userService.userUpdate(data, userId);
      if (response.success) {
        res.json({
          result: response.result,
          success: true,
          message: "user updated ",
        });
      } else {
        res.json({ success: false, message: "failed to update" });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
