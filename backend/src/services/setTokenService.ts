import { Response } from "express";
import { ISetTokenService } from "./serviceInterface/ISetTokenService";

export class SetTokenService implements ISetTokenService {
  setRefreshToken(res: Response, token: string): void {
    res.cookie("refreshToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
