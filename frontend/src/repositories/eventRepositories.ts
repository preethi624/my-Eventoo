import { type AxiosResponse } from "axios";
import { AxiosError } from "axios";

import type {
 
  EventFetchResponse,
  IEventDTO,
  Location,
} from "../interfaces/IEvent";
import type { EventEdit } from "../assets/pages/OrganiserEvents";
import axiosInstance from "../utils/axiosUser";


const API_BASE_URL = `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/event`;

interface CreateEvent {
  success: boolean;
  message?: string;
  data?: unknown;
}

interface EventGetById {
  result?: { result: IEventDTO };
  success: boolean;
  message?: string;
}

export const createEvent = async (data: FormData): Promise<CreateEvent> => {
  try {
    
    
    
    
    const response: CreateEvent = await axiosInstance.post(
      `${API_BASE_URL}/event`,
      data
    );
    if (response.success) {
      return response;
    } else {
      return { success: true, message: "failed to create event" };
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
const eventDelete = async (
  eventId: string | undefined
): Promise<CreateEvent> => {
  try {
    const response: CreateEvent = await axiosInstance.delete(
      `${API_BASE_URL}/event/${eventId}`
    );
    return response;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const getOrganiserEvents = async (
  filters: string
): Promise<EventFetchResponse> => {
  try {
   
    
    const response = await axiosInstance.get<EventFetchResponse>(
      `${API_BASE_URL}/events?${filters}`
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};

export const getCompletedEvents = async (
  filters: string
): Promise<EventFetchResponse> => {
  try {
   
    
    const response = await axiosInstance.get<EventFetchResponse>(
      `${API_BASE_URL}/completed?${filters}`
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const getEventById = async (id: string): Promise<EventGetById> => {
  try {
    const response = await axiosInstance.get<EventGetById>(
      `${API_BASE_URL}/event/${id}`
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const editEvent = async (
  id: string,
  editForm: EventEdit
): Promise<CreateEvent> => {
 
  
  try {
    
    const formData=new FormData();
    formData.append("title",editForm.title);
    formData.append("capacity",String(editForm.capacity));
    formData.append("category",editForm.category);
    formData.append("date",editForm.date);
    formData.append("time",editForm.time);
    formData.append("status",editForm.status);
    formData.append("ticketPrice",String(editForm.ticketPrice));
    formData.append("ticketSold",String(editForm.ticketsSold));
    formData.append("venue",editForm.venue);
    if(editForm.images&&editForm.images[0]){
      const firstImage = editForm.images[0];
      
   if (firstImage instanceof File) {
   
    formData.append("image", firstImage);
  }
    }


    
    
    const response: AxiosResponse<CreateEvent> = await axiosInstance.put(
      `${API_BASE_URL}/event/${id}`,
      formData,{
        headers:{
          "Content-Type":"multipart/form-data"
        }
      }
    );
    if (response.data) {
      return response.data;
    } else {
      return { success: true, message: "failed to create event" };
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const checkStatus = async (email: string) => {
  try {
    const token = localStorage.getItem("userToken");
    const response = await axiosInstance.post(
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
export const getEvents = async (
  id: string,
  currentPage: number,
  limit: number,
  queryParams: string
)=> {
 
  
  try {
   
    
    const response = await axiosInstance.get(
      `${API_BASE_URL}/events/${id}?limit=${limit}&page=${currentPage}&${queryParams}`
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const getEventsCreated = async ()=> {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/eventCount`);

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const getDashboardEvents = async (
  organiserId: string,
  timeFrame: string
) => {
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/dashboardEvents/${organiserId}?timeFrame=${timeFrame}`
    );

    return response;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const fetchEvents = async (id: string) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/orgEvents/${id}`);

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const findEvent = async (eventName: string) => {
  const response = await axiosInstance.get(
    `${API_BASE_URL}/event?name=${encodeURIComponent(eventName)}`
  );
  if (response) {
    return response.data;
  }
};
export const fetchEventsByCategory = async (category: string) => {
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/eventsByCat?name=${category}`
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const findRecommended=async(filters:string)=>{
  try {
    const response=await axiosInstance.get(`${API_BASE_URL}/recommended?${filters}`);
    if(response){
      return response.data
    }
    
  } catch (error) {
     const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
    
  }
  
}
export const fetchNearByEvents=async({latitude,longitude}:Location,filters:string)=>{
  try {
   
    
   
    
    
    
    const response=await axiosInstance.get(`${API_BASE_URL}/near?lat=${latitude}&lng=${longitude}&${filters}`);
    console.log("reee",response);
    
 
    
   
    
    
    
    return response.data
    
    
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
    
  }
}

export const eventRepository = {
  createEvent,
  eventDelete,
  getOrganiserEvents,
  getEventById,
  editEvent,
  checkStatus,
  getEvents,
  getEventsCreated,
  getDashboardEvents,
  fetchEvents,
  findEvent,
  fetchEventsByCategory,
  findRecommended,
  fetchNearByEvents,
  getCompletedEvents
};
