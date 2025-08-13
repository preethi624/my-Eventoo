import { IEvent } from "src/model/event";

import { IUser } from "./IUserAuth";
import { IOrganiser } from "./IOrgAuth";

import { IAdminOrder } from "./IAdmin";

export interface EventGet {
  message: string;
  success: boolean;
  result?: IEvent[];
  response?: GetEvent;
}
export interface EventById {
  message: string;
  success: boolean;
  result?: IEvent;
}
export interface CreateEvent {
  success: boolean;
  message: string;
}
export interface EventEdit {
  id: string;

  title: string;
  date: string;
  venue: string;
  ticketsSold?: number;
  status: string;
  description: string;
  ticketPrice: number;
  capacity: number;
  category: string;
  time: string;
}
export interface EditEvent {
  title: string;
  description: string;
  date: string;
  time: string;

  venue: string;
  capacity: number;
  status: string;
}
export interface EventEdit {
  message: string;
  success: boolean;
}
export interface EditOrg {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  status?: "pending" | "approved" | "rejected";
}
export interface StatusCheck {
  result?: IUser;
  success: boolean;
}
export interface OrgStatusCheck {
  result?: IOrganiser;
  success: boolean;
}
export interface GetEvent {
  events: IEvent[];
  totalPages: number;
  currentPage: number;
}
export interface IEventFilter {
  searchLocation?: string;
  searchTitle?: string;
  selectedCategory?: string;
  maxPrice?: number;
  selectedDate?: string;
  page?: number;
  limit?: number;
  orgName?: string;
}
export interface EventCount {
  count?: number;
  success: boolean;
}
export interface IOrderFilter {
  searchTerm?: string;
  statusFilter?: string;
  selectedDate?: string;
  page?: number;
  limit?: number;
  organiser?: string;
  user?: string;
}

export interface GetOrder {
  message?: string;
  success?: boolean;
  result?: IAdminOrder;
}
export interface DashboardOrder {
  orderId: string;
  amount: number;
  ticketCount: number;
  status: "created" | "paid" | "failed" | "refunded";
  bookingStatus: "confirmed" | "pending" | "cancelled";
  createdAt: Date;
  userInfo: {
    name: string;
    email: string;
  };
}

export interface DashboardStats {
  confirmed: number;
  pending: number;
  cancelled: number;
  salesTrend: {
    date: string;
    sales: number;
  }[];
}

export type DashboardResponse = {
  event: IEvent | null;
  orders: DashboardOrder[];
  stats: DashboardStats;
};
export interface DashboardServiceResponse {
  success: boolean;
  message: string;
  data?: DashboardResponse;
}
export interface DashboardDatas {
  month: number;
  revenue: number;
  events: number;
}
export interface DashboardEvents {
  success: boolean;
  message: string;
  events?: IEvent[];
  data?: DashboardDatas[];
  adminPercentage?: number;
  organiserEarning?: number;
  totalEvents?: number;
  totalAttendees?: number;
  topEvents?: IEvent[];
  upcomingEvents?: IEvent[];
  orderDetails?: {
    name: string;
    email: string;
    eventTitle: string;
    eventDate: Date;
    orderDate: Date;
    amount: number;
    ticketCount: number;
  }[];
}
export interface EventFind {
  result?: IEvent;
  success: boolean;
}
export interface EventByCat {
  result?: IEvent[];
  success?: boolean;
}
