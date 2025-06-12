import { OrgStatusCheck } from "src/interface/event";
import { GetOrganiser } from "src/interface/IOrgAuth";
import { FetchOrders, GetOrder } from "src/interface/IPayment";
import { EditOrganiserResult, ProfileEdit, Reapply } from "src/interface/IUser";

export interface IOrganiserService{
    orgGetById(id:string):Promise<GetOrganiser>
    statusCheck(email:object):Promise<OrgStatusCheck>;
    organiserUpdate(data:ProfileEdit,organiserId:string):Promise<EditOrganiserResult>;
    bookingFetch(organiserId:string,limit:number,page:number):Promise<FetchOrders>;
     orderGetDetails(orderId:string):Promise<GetOrder>;
     reapplyOrg(organiserId:string):Promise<Reapply>
}