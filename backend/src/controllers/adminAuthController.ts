import { ISetTokenService } from "src/services/serviceInterface/ISetTokenService";
import { Request, Response } from "express";
import { LoginBody, LoginResult } from "src/interface/IUserAuth";
import { IAdminAuthController } from "./controllerInterface/IAdminAuthController";
import { IAdminAuthService } from "src/services/serviceInterface/IAdminAuthService";
import { StatusCode } from "../constants/statusCodeEnum";
import { MESSAGES } from "../constants/messages";

export class AdminAuthController implements IAdminAuthController {
  constructor(
    private _authService: IAdminAuthService,
    private setTokenService: ISetTokenService
  ) {}
  async adminLogin(
    req: Request<unknown, unknown, LoginBody>,
    res: Response
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      const result: LoginResult = await this._authService.loginAdmin({
        email,
        password,
      });
      if (!result.success) {
        res.status(StatusCode.UNAUTHORIZED).json({ message: result.message });
        return;
      }
      if (result.refreshToken) {
        this.setTokenService.setRefreshToken(res, result.refreshToken);
      }

      res.json(result);
    } catch (error) {
      console.log(error);

      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: MESSAGES.COMMON.SERVER_ERROR });
    }
  }
}
