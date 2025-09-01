
import { AxiosError } from "axios";
import type {
  OrderCreateInput,
  RazorpayPaymentResponse,
  UserProfile,
} from "../interfaces/IPayment";
import axiosInstance from "../utils/axiosUser";
import type { IGetOrdersResponse } from "../interfaces/IOrder";

const API_BASE_URL = `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/payment`;
export const createOrder = async (data: OrderCreateInput) => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}/order`, data);
    console.log("resorder",response);
    

    if (response.data && response.data.success) {
      return response.data;
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const verifyPayment = async (
  paymentResponse: RazorpayPaymentResponse
) => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/verify`,
      paymentResponse
    );
    if (response.data && response.data.success) {
      return { success: true, message: response.data.message};
    } else {
      return { success: false, message:response.data.message };
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const failurePayment = async (
  payStatus: string,
  orderId: string,
  userId: string
) => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}/failure`, {
      payStatus,
      orderId,
      userId,
    });
    console.log("orderId", orderId);

    if (response.data && response.data.success) {
      return { success: true, message: "status updated successfully" };
    } else {
      return { success: false, message: "Payment status updation  fails" };
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const getOrders = async (
  userId: string,
  currentPage: number,
  limit: number,
  queryParams: string
): Promise<IGetOrdersResponse> => {
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/orders/${userId}?limit=${limit}&page=${currentPage}&${queryParams}`
    );

    if (response.data && response.data.success) {
      return {
        success: true,
        message: "order got successfully",
        order: response.data.order,
      };
    } else {
      return { success: false, message: "Failed to fetch order" };
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const getOrderDetails = async (orderId: string, userId: string) => {
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/order/${userId}/${orderId}`
    );
    if (response.data && response.data.success) {
      return {
        success: true,
        message: "order got successfully",
        order: response.data.order,
      };
    } else {
      return { success: false, message: "Failed to fetch order" };
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const getEventBooked = async (): Promise<UserProfile> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/order`);
    if (response) {
      return {
        totalSpent: response.data.totalSpent,
        eventsBooked: response.data.eventsBooked,
        success: true,
      };
    } else {
      return { success: false };
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const findOrder = async (orderId: string) => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/order/${orderId}`
    );
    console.log("responseeee", response);

    if (response.data && response.data.response.success) {
      return {
        success: true,
        message: "status updated successfully",
        refund: response.data,
      };
    } else {
      return { success: false, message: "Payment status updation  fails" };
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
    return { success: false, message: "updation fails" };
  }
};
export const getTickets = async (orderId: string) => {
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/tickets/${orderId}`
    );
    if (response) {
      return response.data;
    } else {
      return { success: false };
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const getTicketDetails = async (userId: string, queryParams: string,page:number,limit:number) => {
  try {
   
    
    const response = await axiosInstance.get(
      `${API_BASE_URL}/ticketDetails/${userId}?${queryParams}&page=${page}&limit=${limit}`
    );
    console.log("detailResponse", response);
    if (response) {
      return response.data;
    } else {
      return { success: false };
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const createFreeBooking = async (data: OrderCreateInput) => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/freeOrder`,
      data
    );

    if (response.data && response.data.success) {
      return response.data;
    } else {
      return { success: true, message: "failed to create order" };
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};


export const paymentRepository = {
  createOrder,
  verifyPayment,
  getOrders,
  getOrderDetails,
  failurePayment,
  getEventBooked,
  findOrder,
  getTickets,
  getTicketDetails,
  createFreeBooking,
};
