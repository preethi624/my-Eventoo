import { IUser, IUserDTO } from "src/interface/IUserAuth";

export const mapUserToDTO = (user: IUser): IUserDTO => ({
  _id: user._id,

  name: user.name,
  email: user.email,

  isBlocked: user.isBlocked,
});
