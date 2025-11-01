import { IOrganiser } from "src/interface/IOrgAuth";
import { ProfileEdit } from "src/interface/IUser";
import { IUser } from "src/interface/IUserAuth";
import { IOffer } from "src/model/offer";
import { IVenue } from "src/model/venue";

export interface IUserRepository{
    getUser(userId:string):Promise<IUser|null>;
    updateUser(data:ProfileEdit,userId:string):Promise<IUser|null>;
     getOrgs(userId:string):Promise<IOrganiser[]>;
      changePassword(userId:string,newPass:string,currentPass:string):Promise<{success:boolean}|undefined>
      fetchVenues():Promise<IVenue[]>
       fetchOffer(code:string):Promise<IOffer|null>
}