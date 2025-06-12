import { OrgAuthController } from "../controllers/orgAuthController";

import { OrganiserAuthRepository } from "../repositories/organiserAuthRepository";
import { MailService } from "../services/mailService";
import { OrganiserAuthService } from "../services/organiserAuthService";
import { OTPService } from "../services/otpService";
import { PasswordService } from "../services/passwordService";
import { SetTokenService } from "../services/setTokenService";
import { TokenService } from "../services/tokenService";


const authRepository=new OrganiserAuthRepository()
const otpService=new OTPService();
const mailService=new MailService();
const tokenService=new TokenService();
const passwordService=new PasswordService();
const setTokenService=new SetTokenService();
const authService=new OrganiserAuthService (authRepository,otpService,mailService,tokenService,passwordService);
export const authController=new OrgAuthController(authService,setTokenService)
