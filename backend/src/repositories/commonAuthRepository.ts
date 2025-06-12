
import { OrganiserAuthRepository } from "./organiserAuthRepository";
import { ICommonAuthRepository } from "./repositoryInterface/ICommonAuthRepository";
import { UserAuthRepository } from "./userAuthRepository";

export class CommonAuthRepository {
    static getRepository(userType:'user'|'organiser'):ICommonAuthRepository{
        if (userType === 'user') return new UserAuthRepository();
    return new OrganiserAuthRepository();
    }
   
  
    
}