import bcrypt from "bcrypt";
import { IPasswordService } from "./serviceInterface/IPasswordService";

export class PasswordService implements IPasswordService {
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
