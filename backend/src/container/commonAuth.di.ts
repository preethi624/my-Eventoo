
import { AuthController } from "../controllers/authController";
import { AuthService } from "../services/authService";
import { MailService } from "../services/mailService";
import { OTPService } from "../services/otpService";
import { PasswordService } from "../services/passwordService";



const otpService=new OTPService();
const mailService=new MailService();
const passwordService=new PasswordService;

const authService = new AuthService(
  otpService,
  mailService,
  passwordService,

);

export const authController=new AuthController(authService)