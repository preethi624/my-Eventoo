import { LoginBody, LoginResult } from "src/interface/IUserAuth";
import { ITokenService } from "./serviceInterface/ITokenService";
import { IPasswordService } from "./serviceInterface/IPasswordService";
import { IAdmin } from "src/interface/IAdmin";
import { IAdminAuthService } from "./serviceInterface/IAdminAuthService";
import { IAdminAuthRepository } from "src/repositories/repositoryInterface/IAdminAuthRepository";
import { MESSAGES } from "../constants/messages";

export class AdminAuthService implements IAdminAuthService {
  constructor(
    private _authRepository: IAdminAuthRepository,
    private _tokenService: ITokenService,
    private _passwordService: IPasswordService
  ) {}

  async loginAdmin({ email, password }: LoginBody): Promise<LoginResult> {
    try {
      const admin: IAdmin | null = await this._authRepository.findAdminByEmail(
        email
      );
      if (!admin) {
        return { message: MESSAGES.COMMON.NOT_FOUND, success: false };
      }
      const isMatch = this._passwordService.comparePassword(
        password,
        admin.password
      );
      if (!isMatch) {
        return { success: false, message: "Password not matching" };
      }
      const payload = { id: admin._id, role: "admin", email: admin.email };
      const accessToken = this._tokenService.generateAccessToken(payload);

      const refreshToken = this._tokenService.generateRefreshToken(payload);
      return {
        success: true,
        accessToken,
        refreshToken,
        message: "Login successfully",
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: MESSAGES.COMMON.SERVER_ERROR,
      };
    }
  }
}
