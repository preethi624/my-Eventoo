import axios, { AxiosError } from "axios";

import type { User } from "../assets/pages/AdminUser";

import type { IEventDTO } from "../interfaces/IEvent";
import type { IUser } from "../interfaces/IUser";
import type { Organiser } from "../assets/pages/AdminOrganiser";
import type { LoginResponse } from "../redux/thunk/adminAuthThunk";
import type { VenueUpdate } from "../interfaces/IVenue";
import type { AdminDashboard } from "../interfaces/IAdmin";
import axiosInstance from "../utils/axiosUser";

const API_BASE_URL = `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/admin`;

interface Credentials {
  email: string;
  password: string;
}

interface GetOrganisers {
  success: boolean;
  result?: Organiser[];
  message?: string;
}
interface EditOrganiser {
  success: boolean;
  message: string;
}

interface EditUser {
  success: boolean;
  message: string;
}
interface GetEvents {
  success: boolean;
  result?: IEventDTO[];
  message?: string;
}
interface EditEvent {
  success: boolean;
  message: string;
}
interface EventEdit {
  title: string;
  description: string;
  date: string;
  time: string;

  venue: string;
  capacity: number;
  status: string;
}

export const adminLogin = async (
  credentials: Credentials
): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/admin/login`,
      credentials
    );
    console.log("res", response);

    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw err.response?.data?.message || err.message;
  }
};

export const getAllOrganisers = async (
  limit: number,
  currentPage: number,
  searchTerm:string,
  filterStatus:string,
  sortBy:string
): Promise<GetOrganisers> => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await axios.get(
      `${API_BASE_URL}/organisers?limit=${limit}&&page=${currentPage}&&searchTerm=${searchTerm}&&filterStatus=${filterStatus}&&sortBy=${sortBy}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("resooo", response);

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const updateOrganiser = async (
  organiserId: string,
  formData: Omit<Organiser, "_id">
): Promise<EditOrganiser> => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await axios.put<EditOrganiser>(
      `${API_BASE_URL}/organiser/${organiserId}`,
      formData,
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

export const organiserBlock = async (
  organiser: Organiser
): Promise<EditOrganiser> => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await axios.put(`${API_BASE_URL}/organiser`, organiser, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const getAllUsers = async (limit: number, currentPage: number,searchTerm:string,filterStatus:string,sortBy:string) => {
  try {
    console.log("filter status",filterStatus);
    
    const token = localStorage.getItem("adminToken");
    const response = await axios.get(
      `${API_BASE_URL}/users?limit=${limit}&&page=${currentPage}&&searchTerm=${searchTerm}&&filterStatus=${filterStatus}&&sortBy=${sortBy}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("reee", response);

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const updateUser = async (
  id: string,
  formData: Omit<User, "_id">
): Promise<EditUser> => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await axios.put<EditUser>(
      `${API_BASE_URL}/user/${id}`,
      formData,
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
export const blockUser = async (user: IUser) => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await axios.put(`${API_BASE_URL}/user`, user, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const getAllEvents = async (filters: string) => {
  try {
    console.log("filt",filters);
    
    const token = localStorage.getItem("adminToken");

    const response = await axios.get<GetEvents>(
      `${API_BASE_URL}/events/?${filters}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("respoo", response);

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const updateEvent = async (
  id: string,
  formData: EventEdit
): Promise<EditEvent> => {
  try {
    const token = localStorage.getItem("adminToken");
    console.log("form", formData);

    const response = await axios.put<EditEvent>(
      `${API_BASE_URL}/event/${id}`,
      formData,
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

export const blockEvent = async (event: IEventDTO): Promise<EditEvent> => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await axios.put(`${API_BASE_URL}/event`, event, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const fetchBookings = async (filters: string) => {
  console.log("filt", filters);

  try {
    const token = localStorage.getItem("adminToken");

    const response = await axios.get(`${API_BASE_URL}/order/?${filters}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const createVenue = async (formData: FormData) => {
  try {
    console.log("form", formData);

    const token = localStorage.getItem("adminToken");

    const response = await axios.post(`${API_BASE_URL}/venue`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("respo", response);

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const fetchVenues = async (filters: string) => {
  try {
    const token = localStorage.getItem("adminToken");

    const response = await axios.get(`${API_BASE_URL}/venues/?${filters}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("ressss", response);

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const editVenue = async (
  updateData: VenueUpdate
): Promise<EditEvent> => {
  try {
    const token = localStorage.getItem("adminToken");

    const response = await axios.put<EditEvent>(
      `${API_BASE_URL}/venue`,
      updateData,
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
export const venueDelete = async (venueId: string): Promise<EditEvent> => {
  try {
    const token = localStorage.getItem("adminToken");

    const response = await axios.delete<EditEvent>(
      `${API_BASE_URL}/venue/${venueId}`,
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
const getDashboard = async () => {
  try {
    const token = localStorage.getItem("adminToken");

    const response = await axios.get<AdminDashboard>(
      `${API_BASE_URL}/dashboardEvents`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("respooop", response);

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
const fetchUsers = async () => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await axios.get(`${API_BASE_URL}/dashboardUsers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
const getDashboardOrders = async (params: Record<string, string>) => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await axios.get(`${API_BASE_URL}/dashboardOrders`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("orderResponse", response);

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const fetchOrderById=async(orderId:string)=>{
  try {
    
    
    const token = localStorage.getItem("adminToken");


    const response = await axios.get(`${API_BASE_URL}/details/${orderId}`, {
      
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    
    console.log("admin res",response);
    
   
      return response.data
    
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
}

export const adminRepository = {
  adminLogin,
  getAllOrganisers,
  updateOrganiser,

  organiserBlock,
  getAllUsers,
  updateUser,
  blockUser,
  getAllEvents,
  updateEvent,
  blockEvent,
  fetchBookings,
  createVenue,
  fetchVenues,
  editVenue,
  venueDelete,
  getDashboard,
  fetchUsers,
  getDashboardOrders,
  fetchOrderById
};
