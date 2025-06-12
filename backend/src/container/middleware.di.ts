import { TokenService } from "../services/tokenService";
import { authMiddlewareFactory } from "./authMiddlewareFactory";

const tokenService=new TokenService();
export const authMiddlewarwSet=authMiddlewareFactory(tokenService)