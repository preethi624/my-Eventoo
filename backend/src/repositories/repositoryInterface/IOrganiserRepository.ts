import { IOrganiser } from "src/interface/IOrgAuth";
import { FetchOrders } from "src/interface/IPayment";
import { ProfileEdit } from "src/interface/IUser";
import { IOrder } from "src/model/order";

export interface IOrganiserRepository{
    getOrganiserById(id:string):Promise<IOrganiser|null>
    statusCheck(emailObj:{email:string}):Promise<IOrganiser|null>;
    updateOrganiser(data:ProfileEdit,organiserId:string):Promise<IOrganiser|null>;
    fetchBooking(organiserId:string,limit:number,page:number):Promise<FetchOrders>;
    getOrderDetails(orderId:string):Promise<IOrder|null>;
     orgReapply(organiserId:string):Promise<IOrganiser|null>;
    
}