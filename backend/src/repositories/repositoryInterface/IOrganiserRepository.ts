import { DashboardResponse } from "src/interface/event";
import { IOrganiser } from "src/interface/IOrgAuth";
import { FetchOrders } from "src/interface/IPayment";
import { ProfileEdit } from "src/interface/IUser";
import { OrgVenueFilter, VenueFetch } from "src/interface/IVenue";
import { IOrder } from "src/model/order";
import { IVenue } from "src/model/venue";

export interface IOrganiserRepository{
    getOrganiserById(id:string):Promise<IOrganiser|null>
    statusCheck(emailObj:{email:string}):Promise<IOrganiser|null>;
    updateOrganiser(data:ProfileEdit,organiserId:string):Promise<IOrganiser|null>;
    fetchBooking(organiserId:string,limit:number,page:number,searchTerm:string,status:string,date:string):Promise<FetchOrders>;
    getOrderDetails(orderId:string):Promise<IOrder|null>;
     orgReapply(organiserId:string):Promise<IOrganiser|null>;
     getVenues(filters:OrgVenueFilter):Promise<VenueFetch>;
     getVenueById(venueId:string):Promise<IVenue|null>;
     getDashboard(eventId: string):Promise<DashboardResponse>
    
}