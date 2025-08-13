

import { IOtp, RegisterInput } from "../interface/IUserAuth";

import OTP from "../model/otp";

import { IOrganiserAuthRepository } from "./repositoryInterface/IOrganiserAuthRepository";
import { ICommonAuthRepository } from "./repositoryInterface/ICommonAuthRepository";

import { IOrganiser } from "../interface/IOrgAuth";
import Organiser from "../model/organiser";

export class OrganiserAuthRepository
  implements IOrganiserAuthRepository, ICommonAuthRepository
{
  async findByEmail(email: string): Promise<IOrganiser | null> {
    return await Organiser.findOne({ email });
  }
  async findOtp(email: string): Promise<IOtp | null> {
    return await OTP.findOne({ email });
  }
  async updateAccount(email: string, password: string): Promise<void> {
    await Organiser.findOneAndUpdate({ email }, { password }, { new: true });
  }

  async findOrganiserByEmail(email: string): Promise<IOrganiser | null> {
    return await Organiser.findOne({ email });
  }
  async createOrganiser(orgData: RegisterInput): Promise<IOrganiser> {
    const createdOrg = await Organiser.create(orgData);
    const organiserObject = createdOrg.toObject() as IOrganiser;
    return {
      ...organiserObject,
      _id: organiserObject._id.toString(),
    };
  }
  async createOTP(otp: string, email: string): Promise<void> {
    await OTP.deleteMany({ email });

    await OTP.create({
      email,
      otp,
    });
  }
  async findOtpByEmail(email: string): Promise<IOtp | null> {
    return await OTP.findOne({ email });
  }
}