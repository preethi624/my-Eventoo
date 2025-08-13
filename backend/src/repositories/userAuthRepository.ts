import { IOtp, IUser, RegisterInput } from "../interface/IUserAuth";
import OTP from "../model/otp";
import User from "../model/user";
import { ICommonAuthRepository } from "./repositoryInterface/ICommonAuthRepository";
import { IUserAuthRepository } from "./repositoryInterface/IUserAuthRepository";

export class UserAuthRepository
  implements IUserAuthRepository, ICommonAuthRepository
{
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }
  async findOtp(email: string): Promise<IOtp | null> {
    return await OTP.findOne({ email });
  }
  async updateAccount(email: string, password: string): Promise<void> {
    await User.findOneAndUpdate({ email }, { password }, { new: true });
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }
  async createOTP(otp: string, email: string): Promise<void> {
    await OTP.deleteMany({ email });

    await OTP.create({
      email,
      otp,
    });
  }

  async findOtpByEmail(email: string): Promise<IOtp | null> {
    console.log("email", email);

    return await OTP.findOne({ email });
  }
  async createUser(userData: RegisterInput): Promise<IUser> {
    console.trace("createUser called");

    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("Email already registered");
    }
    const createdUser = await User.create(userData);
    const userObject = createdUser.toObject() as IUser;
    return {
      ...userObject,
      _id: userObject._id.toString(),
    };
  }
}
