
import { JwtPayload } from 'jsonwebtoken';
export interface ITokenService{
    
  generateAccessToken(payload: object): string;
  generateRefreshToken(payload: object): string;
verifyAccessToken(token: string): JwtPayload | string;
verifyRefreshToken(token: string): JwtPayload | string 

}