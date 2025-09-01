import { GetOrganiser, IOrganiser } from "src/interface/IOrgAuth";
import { IOrganiserService } from "./serviceInterface/IOrganiserService";
import { IOrganiserRepository } from "src/repositories/repositoryInterface/IOrganiserRepository";
import {
  DashboardEvents,
  DashboardServiceResponse,
  OrgStatusCheck,
} from "src/interface/event";
import {
  Attendees,
  EditOrganiserResult,
  GetUsers,
  ProfileEdit,
  Reapply,
} from "src/interface/IUser";
import { FetchOrders, GetOrder, Update } from "src/interface/IPayment";
import { GetVenue, OrgVenueFilter, VenueFetch } from "src/interface/IVenue";
import { MESSAGES } from "../constants/messages";
import { OrganiserRepository } from "src/repositories/organiserRepository";
import { IUser } from "src/interface/IUserAuth";
import { IOrder } from "src/model/order";
import Razorpay from "razorpay";
import { IVenues } from "src/interface/IVenues";
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export class OrganiserService implements IOrganiserService {
  constructor(private _organiserRepository: IOrganiserRepository) {}

  async orgGetById(id: string): Promise<GetOrganiser> {
    try {
      const result: IOrganiser | null =
        await this._organiserRepository.getOrganiserById(id);
      if (result) {
        return {
          result,
          success: true,
          message: "organiser fetched successfully",
        };
      } else {
        return { success: false, message: "No organiser found" };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "not getting event" };
    }
  }
  async statusCheck(email: { email: string }): Promise<OrgStatusCheck> {
    try {
      const result = await this._organiserRepository.statusCheck(email);
      if (result) {
        return { result: result, success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }
  async organiserUpdate(
    data: ProfileEdit,
    organiserId: string
  ): Promise<EditOrganiserResult> {
    try {
      const result = await this._organiserRepository.updateOrganiser(
        data,
        organiserId
      );

      if (result) {
        return {
          result: result,
          success: true,
          message: "user updated successfully",
        };
      } else {
        return { success: false, message: "failed to update" };
      }
    } catch (error) {
      console.log(error);
      return { success: false, message: "failed to update" };
    }
  }
  async bookingFetch(
    organiserId: string,
    limit: number,
    page: number,
    searchTerm: string,
    status: string,
    date: string
  ): Promise<FetchOrders> {
    try {
      const result = await this._organiserRepository.fetchBooking(
        organiserId,
        limit,
        page,
        searchTerm,
        status,
        date
      );

      if (result) {
        return {
          success: true,
          message: "orders fetched successfully",
          result: result.result,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
        };
      } else {
        return { success: false, message: "failed to fetch" };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "failed to fetch orders" };
    }
  }
  async orderGetDetails(orderId: string): Promise<GetOrder> {
    try {
      const result = await this._organiserRepository.getOrderDetails(orderId);
      console.log("fetch result", result);

      if (result) {
        return {
          success: true,
          message: "orders fetched successfully",
          order: result,
        };
      } else {
        return { success: false, message: "failed to fetch" };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "failed to fetch orders" };
    }
  }
  async reapplyOrg(organiserId: string): Promise<Reapply> {
    try {
      const result = await this._organiserRepository.orgReapply(organiserId);
      console.log("fetch result", result);

      if (result) {
        return { success: true, message: "reapplied successfully" };
      } else {
        return { success: false, message: "failed to reapply" };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "failed to reapply" };
    }
  }
  async venuesGet(filters: OrgVenueFilter): Promise<VenueFetch> {
    try {
      const result = await this._organiserRepository.getVenues(filters);

      if (result) {
        return {
          success: true,
          message: "venues fetched successfully",
          venues: result.venues,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
        };
      } else {
        return { success: false, message: "failed to fetch" };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "failed to fetch orders" };
    }
  }
  async venueGetById(venueId: string): Promise<GetVenue> {
    try {
      const result = await this._organiserRepository.getVenueById(venueId);

      if (result) {
        return {
          success: true,
          message: "orders fetched successfully",
          venue: result,
        };
      } else {
        return { success: false, message: "failed to fetch" };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "failed to fetch venue" };
    }
  }

  async dashboardGet(eventId: string): Promise<DashboardServiceResponse> {
    try {
      const result = await this._organiserRepository.getDashboard(eventId);

      if (result) {
        return {
          success: true,
          message: "orders fetched successfully",
          data: result,
        };
      } else {
        return { success: false, message: "failed to fetch" };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "failed to fetch venue" };
    }
  }
  async attendeesFetch(
    eventId: string,
    organiserId: string,
    filters: string,
    filterStatus: string,
    page: number,
    limit: number
  ): Promise<Attendees> {
    try {
      const response = await this._organiserRepository.fetchAttendees(
        eventId,
        organiserId,
        filters,
        filterStatus,
        page,
        limit
      );
      if (response) {
        return {
          success: true,
          message: "fetched successfully",
          attendees: response.attendees,
          revenue: response.revenue,
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalAttendees: response.totalAttendees,
        };
      } else {
        return { success: false, message: "failed" };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: MESSAGES.EVENT.FAILED_TO_FETCH };
    }
  }
  async getDashboardEvents(
    organiserId: string,
    timeFrame: "7d" | "30d" | "90d",
    startDate?: string,
    endDate?: string,
    category?: string,
    month?: string,
    year?: string
  ): Promise<DashboardEvents> {
    try {
      console.log("serviceStart", startDate);

      const response = await this._organiserRepository.dashboardEvents(
        organiserId,
        timeFrame,
        startDate,
        endDate,
        category,
        month,
        year
      );
      if (response) {
        return {
          success: true,
          events: response.events,
          message: "event fetched successfully",
          data: response.data,
          adminPercentage: response.adminCommissionPercentage,
          organiserEarning: response.organiserEarning,
          totalEvents: response.totalEvents,
          totalAttendees: response.totalAttendees,
          topEvents: response.topEvents,
          upcomingEvents: response.upcomingEvents,
          orderDetails: response.orderDetails,
        };
      } else {
        return { success: false, message: MESSAGES.EVENT.FAILED_TO_FETCH };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "failed" };
    }
  }
  async ticketUpdate(qrToken: string): Promise<{ message: string }> {
    try {
      const response = await this._organiserRepository.updateTicket(qrToken);
      return { message: response.message };
    } catch (error) {
      console.log(error);
      return { message: MESSAGES.EVENT.FAILED_TO_UPDATE };
    }
  }
  async usersGet(): Promise<GetUsers> {
    try {
      const response = await this._organiserRepository.getUsers();
      if (response) {
        return { users: response, success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async eventOrders(eventId:string):Promise<{success:boolean,orders?:IOrder[]}>{
    try {
      const response=await this._organiserRepository.fetchEventOrders(eventId

      )
      if(response){
        return{success:true,orders:response}
      }else{
        return {success:false}
      }

      
    } catch (error) {
      
      console.log(error);
      return {success:false}
      
    }
  }
  async orderCancel(orderId:string):Promise<Update>{
    try {
      const result = await this._organiserRepository.findOrder(orderId)
     
      
      
      
     
      
      if (result) {
        const paymentId = result.razorpayPaymentId;
        const amount = result.amount;
        const refund =await razorpay.payments.refund (paymentId,{
          amount: amount,

    });

         const payment = await razorpay.payments.fetch(paymentId);
console.log("Razorpay payment:", payment);
        
        

        const refundId = refund.id;
        
        
        const response = await this._organiserRepository.updateRefund(
          refundId,
          orderId
        );
        if (response.success) {
          return {
            success: true,
            refundId: refundId,
            message: "successfully updated",
          };
        } else {
          return { success: false, message: response.message };
        }
      } else {
        return { success: false, message: "failed to update" };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "failed to update" };
    }

  }
  async venuesFetch():Promise<IVenues>{
    try {
      const response=await this._organiserRepository.fetchVenues();
      if(response){
        return{success:true,venues:response}
      }else{
        return{success:false}
      }
      
    } catch (error) {
      console.log(error);
      return{success:false}
      
      
    }
  }
}
