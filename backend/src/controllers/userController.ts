import { Request, Response } from "express";
import { IUserController } from "./controllerInterface/IUserController";
import { IUserService } from "src/services/serviceInterface/IUserService";

import { MESSAGES } from "../constants/messages";
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}
export class UserController implements IUserController {
  constructor(private _userService: IUserService) {}
  async getUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error("userId not get");
      }

      const response = await this._userService.userGet(userId);

      if (response) {
        res.json({
          user: response,
          success: true,
          message: "fetched user successfully",
        });
      } else {
        res.json({ success: false, message: MESSAGES.EVENT.FAILED_TO_FETCH });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async updateUser(req: AuthenticatedRequest, res: Response): Promise<void> {
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
      if (!userId) {
        throw new Error("userId not get");
      }
      const response = await this._userService.userUpdate(data, userId);
      if (response.success) {
        res.json({
          result: response.result,
          success: true,
          message: "user updated ",
        });
      } else {
        res.json({ success: false, message: MESSAGES.EVENT.FAILED_TO_UPDATE });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async getOrgs(req: Request, res: Response): Promise<void> {
    try {
      const response = await this._userService.orgsGet();
      if (response.success) {
        res.json({ response });
      } else {
        res.json({ success: false });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
