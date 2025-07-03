import  { type AxiosResponse } from 'axios';
import { AxiosError } from 'axios';

import type { EventCount, EventFetchResponse, IEventDTO } from '../interfaces/IEvent';
import type { EventEdit } from '../assets/pages/OrganiserEvents';
import axiosInstance from '../utils/axiosUser';

const API_BASE_URL="http://localhost:3000/api/event";

interface CreateEvent{
  success:boolean;
  message?:string;
  data?:unknown
  
  
}
/*interface EventGetResponse {
  result?:{result: IEventDTO[]}
  success: boolean;
  message?: string;
}*/
interface EventGetById{
  result?:{result:IEventDTO}
  success:boolean;
  message?:string;
}





export const createEvent=async(data:FormData):Promise<CreateEvent>=>{
  try {
 

    
   
    
    
    
   
    const response:CreateEvent=await axiosInstance.post(`${API_BASE_URL}/event`,data 
    );
    if(response.success){
      return response

    }else{
      return{success:true,message:"failed to create event"}
    }
    
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
    
  }


}
const eventDelete=async(eventId:string|undefined):Promise<CreateEvent>=>{
  try {
   
    
    
    const response:CreateEvent=await axiosInstance.delete(`${API_BASE_URL}/event/${eventId}`
    );
    return response
    
  } catch (error) {

const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
    
  }


}
export const getOrganiserEvents = async (filters:string): Promise<EventFetchResponse> => {
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




export const getEventById=async(id:string):Promise<EventGetById>=>{
  try {
   
    const response=await axiosInstance.get<EventGetById>(
      `${API_BASE_URL}/event/${id}`
    )
    return response.data

    
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
    
  }
 
}
export const editEvent=async(id:string,editForm:EventEdit):Promise<CreateEvent>=>{
  try {
    
    
    
     
    const response:AxiosResponse<CreateEvent>=await axiosInstance.put(
      `${API_BASE_URL}/event/${id}`,editForm
    )
   if(response.data){
      return response.data

    }else{
      return{success:true,message:"failed to create event"}
    } 
    
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
    
  }
 
  
}
export const checkStatus=async(email:string)=>{
  try {
   
    
   
    
    const token=localStorage.getItem('userToken');
    const response=await axiosInstance.post(`${API_BASE_URL}/checkStatus`,{email}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      
      return response.data
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
    
  }
}
export const getEvents=async(id:string,currentPage:number,limit:number,queryParams:string):Promise<EventFetchResponse>=>{
  try {
   
   
    
 
    
    const response=await axiosInstance.get<EventFetchResponse>(
      `${API_BASE_URL}/events/${id}?limit=${limit}&page=${currentPage}&${queryParams}`
    )
    
    
    
    return response.data

    
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
    
  }
 
}
export const getEventsCreated=async(organiserId:string):Promise<EventCount>=>{
  try {
   
    
   
   
    
 
    
    const response=await axiosInstance.get<EventCount>(
      `${API_BASE_URL}/eventCount/${organiserId}`
    )
    
    
    return response.data

    
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
    
  }
 
}
export const getDashboardEvents=async(organiserId:string,timeFrame:string)=>{
 try {
   
   
    
 
    
    const response=await axiosInstance.get(
      `${API_BASE_URL}/dashboardEvents/${organiserId}?timeFrame=${timeFrame}`
    )
    
    
    
    
    
    
   
    
    
    return response

    
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
    
  }

}
export const fetchEvents=async(id:string)=>{
  try {
   
   
    
 
    
    const response=await axiosInstance.get(
      `${API_BASE_URL}/orgEvents/${id}`
    )
    
    
    
    return response.data

    
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
    
  }
 
}




export const eventRepository={


  createEvent,
  eventDelete,
   getOrganiserEvents,
  getEventById,
  editEvent,
  checkStatus,
  getEvents,
  getEventsCreated,
  getDashboardEvents,
  fetchEvents


}