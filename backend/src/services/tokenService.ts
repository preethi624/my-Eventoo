import { ITokenService } from "./serviceInterface/ITokenService";
import jwt from "jsonwebtoken";


export class TokenService implements ITokenService{
    generateAccessToken(payload: string|object) {
       return jwt.sign(payload, process.env.JWT_KEY as string, { expiresIn: "1h" });
    

        
    }
    generateRefreshToken(payload: object) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_KEY as string, { expiresIn: "7d" });
  }
  verifyAccessToken(token: string): jwt.JwtPayload | string {
    return jwt.verify(token, process.env.JWT_KEY as string);
      
  }
 verifyRefreshToken(token: string): jwt.JwtPayload | string {
    return jwt.verify(token, process.env.REFRESH_TOKEN_KEY as string);
  } 

}