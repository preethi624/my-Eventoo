import { DashboardResponse } from "src/interface/event";
import { IOrganiser } from "src/interface/IOrgAuth";
import { FetchOrders } from "src/interface/IPayment";
import { Attendees, ProfileEdit } from "src/interface/IUser";
import { IUser } from "src/interface/IUserAuth";
import { OrgVenueFilter, VenueFetch } from "src/interface/IVenue";
import { IEvent } from "src/model/event";
import { IOrder } from "src/model/order";
import { IVenue } from "src/model/venue";

export interface IOrganiserRepository {
  getOrganiserById(id: string): Promise<IOrganiser | null>;
  statusCheck(emailObj: { email: string }): Promise<IOrganiser | null>;
  updateOrganiser(
    data: ProfileEdit,
    organiserId: string
  ): Promise<IOrganiser | null>;
  fetchBooking(
    organiserId: string,
    limit: number,
    page: number,
    searchTerm: string,
    status: string,
    date: string
  ): Promise<FetchOrders>;
  getOrderDetails(orderId: string): Promise<IOrder | null>;
  orgReapply(organiserId: string): Promise<IOrganiser | null>;
  getVenues(filters: OrgVenueFilter): Promise<VenueFetch>;
  getVenueById(venueId: string): Promise<IVenue | null>;
  getDashboard(eventId: string): Promise<DashboardResponse>;
  fetchAttendees(
    eventId: string,
    organiserId: string,
    searchTerm: string,
    filterStatus: string,
    page: number,
    limit: number
  ): Promise<Attendees>;
  dashboardEvents(
    organiserId: string,
    timeFrame: "7d" | "30d" | "90d",
    startDate?: string,
    endDate?: string,
    category?: string,
    month?: string,
    year?: string
  ): Promise<{
    events: IEvent[];
    data: {
      month: number;
      revenue: number;
      events: number;
    }[];
    adminCommissionPercentage: number;
    organiserEarning: number;
    totalEvents: number;
    totalAttendees: number;
    topEvents: IEvent[];
    upcomingEvents: IEvent[];
    orderDetails: {
      name: string;
      email: string;
      eventTitle: string;
      eventDate: Date;
      orderDate: Date;
      amount: number;
      ticketCount: number;
    }[];
  }>;

  updateTicket(qrToken: string): Promise<{ message: string }>;
  getUsers(): Promise<IUser[]>;
}
