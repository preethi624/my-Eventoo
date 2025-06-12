import { LoginBody, LoginResult } from "src/interface/IUserAuth";

export interface IAdminAuthService{
    loginAdmin({ email, password }: LoginBody): Promise<LoginResult>
}