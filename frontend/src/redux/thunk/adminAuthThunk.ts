import { adminRepository } from "../../repositories/adminRepositories";
import { adminLoginSuccess } from "../slices/adminSlices";
import type { AppDispatch } from "../stroe";

interface Credentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  message: string;
}

export const loginAdmin =
  (credentials: Credentials) => async (dispatch: AppDispatch) => {
    try {
      const data: LoginResponse = await adminRepository.adminLogin(credentials);
      console.log("data", data);

      if (data.success) {
        dispatch(adminLoginSuccess(data.accessToken));

        return { success: true, token: data.accessToken };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error("adminLogin failed", error);
      return { error, success: false };
    }
  };
