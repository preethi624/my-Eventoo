import { DashboardEvents, DashboardServiceResponse, OrgStatusCheck } from "src/interface/event";
import { GetOrganiser } from "src/interface/IOrgAuth";
import { FetchOrders, GetOrder, Update } from "src/interface/IPayment";
import { Attendees, EditOrganiserResult, GetUsers, ProfileEdit, Reapply } from "src/interface/IUser";
import { GetVenue, OrgVenueFilter, VenueFetch } from "src/interface/IVenue";
import { IVenues } from "src/interface/IVenues";
import { IOrder } from "src/model/order";


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
      attendeesFetch(eventId:string,organiserId:string,filters:string,filterStatus:string,page:number,limit:number):Promise<Attendees>
       getDashboardEvents(organiserId:string,timeFrame:'7d' | '30d' | '90d',startDate?:string,endDate?:string,category?:string,month?:string,year?:string):Promise<DashboardEvents>
       ticketUpdate(qrToken:string):Promise<{message:string}>
        usersGet():Promise<GetUsers>
        eventOrders(eventId:string):Promise<{success:boolean,orders?:IOrder[]}>
        orderCancel(orderId:string):Promise<Update>
        venuesFetch():Promise<IVenues>
}