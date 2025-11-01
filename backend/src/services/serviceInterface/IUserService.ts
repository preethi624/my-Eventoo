import { EditResult, GetOrgs, ProfileEdit, UserGet } from "src/interface/IUser";
import { IOffer } from "src/model/offer";
import { IVenue } from "src/model/venue";

export interface IUserService{
     userGet(userId:string):Promise<UserGet>;
    userUpdate(data:ProfileEdit,userId:string):Promise<EditResult>;
    orgsGet(userId:string):Promise<GetOrgs>;
    passwordChange(userId:string,newPass:string,currentPass:string):Promise<{success:boolean}>
     venuesFetch():Promise<{venues?:IVenue[],success:boolean}>
      offerFetch(code:string):Promise<{offer?:IOffer,success:boolean}>
}