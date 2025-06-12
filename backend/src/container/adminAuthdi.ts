import { AdminAuthController } from "../controllers/adminAuthController";
import { AdminAuthRepository } from "../repositories/adminAuthRepository";
import { AdminAuthService } from "../services/adminAuthService";
import { PasswordService } from "../services/passwordService";
import { SetTokenService } from "../services/setTokenService";
import { TokenService } from "../services/tokenService";

const authRepository=new AdminAuthRepository();


const tokenService=new TokenService();
const passwordService=new PasswordService();
const setTokenService=new SetTokenService()
const authService=new AdminAuthService(authRepository,tokenService,passwordService);
export const adminAuthController=new AdminAuthController(authService,setTokenService)
