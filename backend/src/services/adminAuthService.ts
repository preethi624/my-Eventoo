import { LoginBody, LoginResult } from "src/interface/IUserAuth";
import { ITokenService } from "./serviceInterface/ITokenService";
import { IPasswordService } from "./serviceInterface/IPasswordService";
import { IAdmin } from "src/interface/IAdmin";
import { IAdminAuthService } from "./serviceInterface/IAdminAuthService";
import { IAdminAuthRepository } from "src/repositories/repositoryInterface/IAdminAuthRepository";

export class AdminAuthService implements IAdminAuthService{
    constructor(private authRepository:IAdminAuthRepository,private tokenService:ITokenService,private passwordService:IPasswordService){}

    async loginAdmin({ email, password }: LoginBody): Promise<LoginResult> {
    try {
        const admin:IAdmin|null=await this.authRepository.findAdminByEmail(email);
        if(!admin){
            return{message:"email not found",success:false}

        }
         const isMatch = this.passwordService.comparePassword(password,admin.password)
         if (!isMatch) {
            return { success: false, message: "Password not matching" };
          }
           const payload = { id: admin._id, role: "admin", email: admin.email };
          const accessToken = this.tokenService.generateAccessToken(payload)

        const refreshToken = this.tokenService.generateRefreshToken(payload)
            return {
                success: true,
                accessToken,
                refreshToken,
                message:"Login successfully"
              };   
    } catch (error) {
        console.error('Login error:', error);
    return {
      success: false,
      message: 'Internal server error',
    };
        
    }

}
}