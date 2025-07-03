import { DashboardServiceResponse, OrgStatusCheck } from "src/interface/event";
import { GetOrganiser } from "src/interface/IOrgAuth";
import { FetchOrders, GetOrder } from "src/interface/IPayment";
import { Attendees, EditOrganiserResult, ProfileEdit, Reapply } from "src/interface/IUser";
import { GetVenue, OrgVenueFilter, VenueFetch } from "src/interface/IVenue";

export interface IOrganiserService{
    orgGetById(id:string):Promise<GetOrganiser>
    statusCheck(email:object):Promise<OrgStatusCheck>;
    organiserUpdate(data:ProfileEdit,organiserId:string):Promise<EditOrganiserResult>;
    bookingFetch(organiserId:string,limit:number,page:number,searchTerm:string,status:string,date:string):Promise<FetchOrders>;
     orderGetDetails(orderId:string):Promise<GetOrder>;
     reapplyOrg(organiserId:string):Promise<Reapply>;
     venuesGet(filters:OrgVenueFilter):Promise<VenueFetch>;
     venueGetById(venueId:string):Promise<GetVenue>;
     dashboardGet(eventId:string):Promise<DashboardServiceResponse>;
      attendeesFetch(eventId:string,organiserId:string,filters:string,filterStatus:string):Promise<Attendees>
}