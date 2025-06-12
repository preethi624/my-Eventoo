import authMiddleware from "../middleware/authMiddleware"
import { ITokenService } from "../services/serviceInterface/ITokenService"

export const authMiddlewareFactory=(tokenSevice:ITokenService)=>{
    return{
        userOnly:authMiddleware(tokenSevice,['user']),
        organiserOnly:authMiddleware(tokenSevice,['organiser']),
        adminOnly:authMiddleware(tokenSevice,['admin']),
        userAndOrganiser: authMiddleware(tokenSevice, ['user','organiser']),

        
    }
}