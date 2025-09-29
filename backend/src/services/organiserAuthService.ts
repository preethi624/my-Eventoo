

import { IOrganiser } from "../interface/IOrgAuth";
import {
  LoginResult,
  RegisterResult,
  Resend,
  VerifyInput,
} from "../interface/IUserAuth";
import { IOrganiserAuthRepository } from "../repositories/repositoryInterface/IOrganiserAuthRepository";
import { IMailService } from "./serviceInterface/IMailService";
import { IOrgAuthService } from "./serviceInterface/IOrgAuthService";
import { IOTPService } from "./serviceInterface/IOtpService";
import { IPasswordService } from "./serviceInterface/IPasswordService";
import { ITokenService } from "./serviceInterface/ITokenService";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import { MESSAGES } from "../constants/messages";

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class OrganiserAuthService implements IOrgAuthService {
  constructor(
    private _authRepository: IOrganiserAuthRepository,
    private _otpService: IOTPService,
    private _mailService: IMailService,
    private _tokenService: ITokenService,
    private _passwordService: IPasswordService
  ) {}
  async loginOrganiser(email: string, password: string): Promise<LoginResult> {
    const organiser: IOrganiser | null =
      await this._authRepository.findOrganiserByEmail(email);
    if (!organiser) return { success: false, message: "Organiser not found" };
    const isMatch = await this._passwordService.comparePassword(
      password,
      organiser.password
    );
    if (!isMatch) return { success: false, message: "password not matching" };
    if (organiser.isBlocked) {
      return {
        success: false,
        message: "Your account has been blocked.Please contact support",
      };
    }
    const payload = {
      id: organiser._id,
      role: "organiser",
      email: organiser.email,
    };
    const accessToken = this._tokenService.generateAccessToken(payload);
    const refreshToken = this._tokenService.generateRefreshToken(payload);

    return {
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
    };
  }
  async registerOrganiser(
    name: string,
    email: string
  ): Promise<RegisterResult> {
    try {
      const existingOrganiser = await this._authRepository.findOrganiserByEmail(
        email
      );

      if (existingOrganiser)
        return { success: false, message: "Organiser already exists" };

      const otp = this._otpService.generateOTP();
      await this._authRepository.createOTP(otp, email);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}\nThis OTP will expire in 10 minutes.`,
      };

      await this._mailService.sendMail(mailOptions);

      return { success: true, message: "OTP sent to your email" };
    } catch (error) {
      console.error("Error in registerUser:", error);
      return { success: false, message: MESSAGES.COMMON.SERVER_ERROR };
    }
  }
  async organiserVerify({
    name,
    email,
    password,
    otp,
  }: VerifyInput): Promise<RegisterResult> {
    try {
      const OTP = await this._authRepository.findOtpByEmail(email);
      if (!OTP) {
        return { success: false, message: "OTP not found, please try again" };
      }
      if (OTP.otp != otp) {
        return {
          success: false,
          message: "otp verification failed,please try again",
        };
      }
      const hashedPassword = await this._passwordService.hashPassword(password);
      await this._authRepository.createOrganiser({
        name,
        email,
        password: hashedPassword,
      });

      return { success: true, message: "User registered successfully" };
    } catch (error) {
      console.error("Error in otpVerification:", error);
      return { success: false, message: MESSAGES.COMMON.SERVER_ERROR };
    }
  }
  async resendOrganiser({ email }: Resend): Promise<RegisterResult> {
    try {
      const otp = this._otpService.generateOTP();

      await this._authRepository.createOTP(otp, email);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}\nThis OTP will expire in 10 minutes.`,
      };

      await this._mailService.sendMail(mailOptions);

      return { success: true, message: "otp send successfully" };
    } catch (error) {
      console.log(error);

      return { success: false, message: MESSAGES.COMMON.SERVER_ERROR };
    }
  }
  async loginOrganiserWithGoogle(credential: string): Promise<RegisterResult> {
    try {
      const googleClientId = process.env.GOOGLE_CLIENT_ID;
      if (!googleClientId)
        throw new Error("Missing GOOGLE_CLIENT_ID in environment variables");

      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: googleClientId,
      });

      const jwtkey = process.env.JWT_KEY;
      if (!jwtkey) throw new Error("Missing JWT_KEY in environment variables");

      const payload = ticket.getPayload();
      if (!payload) throw new Error("Invalid token payload");

      const { email, name, picture, sub: googleId } = payload;
      if (!name || !email || !picture || !googleId) {
        throw new Error(
          "Missing required user information from Google payload"
        );
      }

      let user = await this._authRepository.findOrganiserByEmail(email!);

      if (!user) {
        user = await this._authRepository.createOrganiser({
          name,
          email,
          picture,
          googleId,
          authMethod: "google",
        });
      }
      if (user.isBlocked) {
        return {
          success: false,
          message: "Your account has been blocked. Please contact support.",
        };
      }

<<<<<<< HEAD
      const { exp,iat, ...cleanPayload } = payload;
      console.log("Google token exp:", exp, "issued at:", iat);
=======
      const { exp, iat, ...cleanPayload } = payload;
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
      const accessToken = this._tokenService.generateAccessToken({
        ...cleanPayload,
        role: "organiser",
        id: user._id,
      });
      const refreshToken = this._tokenService.generateRefreshToken({
        ...cleanPayload,
        role: "organiser",
        id: user._id,
      });

      return { success: true, accessToken, refreshToken, message: "success" };
    } catch (error) {
      console.error("Error in loginUserWithGoogle:", error);
      return { success: false, message: "Google authentication failed" };
    }
  }
}