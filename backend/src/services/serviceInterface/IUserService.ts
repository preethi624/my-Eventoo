import { EditResult, GetOrgs, ProfileEdit, UserGet } from "src/interface/IUser";
import { IVenue } from "src/model/venue";

export interface IUserService{
     userGet(userId:string):Promise<UserGet>;
    userUpdate(data:ProfileEdit,userId:string):Promise<EditResult>;
    orgsGet():Promise<GetOrgs>;
    passwordChange(userId:string,newPass:string,currentPass:string):Promise<{success:boolean}>
     venuesFetch():Promise<{venues?:IVenue[],success:boolean}>
}