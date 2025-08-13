import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { ITokenService } from "src/services/serviceInterface/ITokenService";
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload | string;
}
const authMiddleware = (
  tokenService: ITokenService,
  allowedRoles: string[] = []
) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    try {
      const authHeader = req.header("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ success: false, message: "No token provided" });
        return;
      }
      const token = authHeader.split(" ")[1];

      const decoded = tokenService.verifyAccessToken(token);

      req.user = decoded;
      const userRole = (decoded as JwtPayload).role;
      if (!allowedRoles.includes(userRole)) {
        res
          .status(403)
          .json({
            success: false,
            message: "Access denied: insufficient role",
          });
        return;
      }
      next();
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        res.status(401).json({ success: false, message: "Token expired" });
        return;
      }
      res.status(403).json({ success: false, message: "Invalid token" });
      return;
    }
  };
};
export default authMiddleware;
