import axios from "axios";
import { AxiosError } from "axios";


import axiosInstance from "../utils/axiosUser";
import type { OrgOrder } from "../interfaces/IPayment";
import type { GetVenue } from "../interfaces/IVenue";
const API_BASE_URL = `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/organiser`;


export const getOrganiserById = async (
  id: string
) => {
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/organiser/${id}`
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const checkStatus = async (email: string) => {
  try {
    const token = localStorage.getItem("organiserToken");
    const response = await axios.post(
      `${API_BASE_URL}/checkStatus`,
      { email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const updateOrganiser = async (
  formData: FormData,
  organiserId: string
) => {
  try {
    const response = await axiosInstance.put(
      `${API_BASE_URL}/organiser/${organiserId}`,
      formData
    );
    console.log("repRes", response);

    if (response.data.success) {
      return {
        result: response.data,
        success: true,
        message: "user updated successfully",
      };
    } else {
      return { success: false, message: "failed to update user" };
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const fetchBookings = async (
  organiserId: string,
  page: number,
  limit: number,
  queryParams: string
) => {
  try {
    console.log("Query Params:", queryParams);

    const response = await axiosInstance.get(
      `${API_BASE_URL}/orgOrder/${organiserId}?limit=${limit}&page=${page}&${queryParams}`
    );

    if (response) {
      return {
        result: response.data.result,
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
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
export const getOrderDetails = async (orderId: string): Promise<OrgOrder> => {
  try {
   
    
    const response = await axiosInstance.get(
      `${API_BASE_URL}/orgOrders/${orderId}`
    );
    console.log("responseDetails", response);

    if (response) {
      return {
        order: response.data.order,
        success: true,
        message: "order fetched success",
      };
    } else {
      return { success: false, message: "failed" };
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const reapply = async (organiserId: string) => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/organiserReapply/${organiserId}`
    );
    if (response.data.success) {
      return { success: true, message: "reapplied successfully" };
    } else {
      return { success: false, message: "failed to reapply" };
    }

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const getVenues = async (filters: string) => {
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/venues/?${filters}`
    );
   

    if (response) {
      return {
        result: response.data,
        success: true,
        message: "venues fetched success",
      };
    } else {
      return { success: false, message: "failed" };
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const getVenueById = async (venueId: string): Promise<GetVenue> => {
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/venue/${venueId}`
    );
    console.log("responseDetails", response);

    if (response) {
      return {
        venue: response.data.venue,
        success: true,
        message: "venue fetched success",
      };
    } else {
      return { success: false, message: "failed" };
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const getDashboard = async (eventId: string) => {
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/getDashboard/${eventId}`
    );
    console.log("resss", response);

    if (response && response.data.success) {
      return {
        event: response.data.data.event,
        orders: response.data.data.orders,
        stats: response.data.data.stats,
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
export const fetchAttendees = async (
  eventId: string,
  organiserId: string,
  searchTerm: string,
  filterStatus: string,
  currentPage: number,
  limit: number
) => {
  try {
    
    const response = await axiosInstance.get(
      `${API_BASE_URL}/order/${eventId}/${organiserId}`,
      { params: { searchTerm, filterStatus, currentPage, limit } }
    );
    console.log("responseeee", response);

    if (response.data) {
      return {
        success: true,
        message: "status updated successfully",
        attendee: response.data,
      };
    } else {
      return { success: false, message: "Payment status updation  fails" };
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const getDashboardEvents = async (
  organiserId: string,
  params: Record<string, string>
) => {
  try {
    console.log("params", params);

    const response = await axiosInstance.get(
      `${API_BASE_URL}/dashboardEvents/${organiserId}`,
      { params }
    );

    console.log("dash", response);

    return response;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const updateTicket = async (qrToken: string) => {
  try {
    const response = await axiosInstance.put(`${API_BASE_URL}/checkin`, {
      qrToken: qrToken,
    });
    if (response && response.data) {
      return { message: response.data.message };
    } else {
      return { message: "scanning failed" };
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const fetchUsers = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/users`);
    console.log("useres", response);

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const getEventOrders=async(eventId:string)=>{
  try {
      const response=await axiosInstance.get(`${API_BASE_URL}/eventOrder/${eventId}`);
      console.log("eveee respooo",response);
      
  if(response.data.success){
    return response.data
  }
}
    
  catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
    
  }
}
export const cancelOrder=async(orderId:string)=>{
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

}
export const fetchVenues=async()=>{
    try {
        const response=await axiosInstance.get(
            `${API_BASE_URL}/venue`

        ) 
        if(response.data.success){
          
          
            return response.data
        }
    
        
    } catch (error) {
        const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
        
    }
    

}


export const organiserRepository = {
  getOrganiserById,
  checkStatus,
  updateOrganiser,
  fetchBookings,
  getOrderDetails,
  reapply,
  getVenues,
  getVenueById,
  getDashboard,
  fetchAttendees,
  getDashboardEvents,
  updateTicket,
  fetchUsers,
  getEventOrders,
  cancelOrder,
  fetchVenues
};
