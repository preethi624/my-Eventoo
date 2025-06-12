
import { UserAuthController } from "../controllers/userAuthController";
import { UserAuthRepository } from "../repositories/userAuthRepository";
import { MailService } from "../services/mailService";
import { OTPService } from "../services/otpService";
import { PasswordService } from "../services/passwordService";
import { SetTokenService } from "../services/setTokenService";
import { TokenService } from "../services/tokenService";
import { UserAuthService } from "../services/userAuthServices";


const authRepository=new UserAuthRepository();
const otpService=new OTPService();
const mailService=new MailService();
const tokenService=new TokenService();
const passwordService=new PasswordService();
const setTokenService=new SetTokenService()
const authService=new UserAuthService(authRepository,otpService,mailService,tokenService,passwordService);
export const authController=new UserAuthController(authService,setTokenService)
