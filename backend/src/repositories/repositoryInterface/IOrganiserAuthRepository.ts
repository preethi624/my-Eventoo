


import { IOrganiser } from "src/interface/IOrgAuth";
import { IOtp, RegisterInput } from "../../interface/IUserAuth";

export interface IOrganiserAuthRepository {
  findOrganiserByEmail(email: string): Promise<IOrganiser | null>;

  findOrganiserByEmail(email: string): Promise<IOrganiser | null>;

  createOrganiser(organiserData: RegisterInput): Promise<IOrganiser>;
  createOTP(otp: string, email: string): Promise<void>;
  findOtpByEmail(email: string): Promise<IOtp | null>;
}
