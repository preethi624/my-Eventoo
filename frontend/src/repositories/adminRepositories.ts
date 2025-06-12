import axios, { AxiosError } from "axios";



import type { User } from "../assets/pages/AdminUser";


import type { IEventDTO } from "../interfaces/IEvent";
import type { IUser } from "../interfaces/IUser";
import type { Organiser } from "../assets/pages/AdminOrganiser";
import type { LoginResponse } from "../redux/thunk/adminAuthThunk";


const API_BASE_URL = "http://localhost:3000/api/admin";

interface Credentials {
  email: string;
  password: string;
}


interface GetOrganisers{
  success:boolean;
  result?:Organiser[];
  message?:string

}
interface EditOrganiser{
  success:boolean;
  message:string
}
interface GetUsers{

 success:boolean;
  result?:IUser[];
  message?:string
}
interface EditUser{
  success:boolean;
  message:string 

}
interface GetEvents{
  success:boolean;
  result?:IEventDTO[];
  message?:string

}
interface EditEvent{
  success:boolean;
  message:string

}
interface EventEdit{
  title: string;
    description: string;
    date: string;
    time:string;
    
    venue: string;
    capacity: number;
    status: string

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

export const getAllOrganisers=async():Promise<GetOrganisers>=>{
  try {
    const token=localStorage.getItem("adminToken");
    const response = await axios.get<GetOrganisers>(
      `${API_BASE_URL}/organisers`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data

   
    
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
    
  }

}
export const updateOrganiser=async(organiserId:string,formData:Omit<Organiser, '_id'>):Promise<EditOrganiser>=>{
  try {
    const token=localStorage.getItem("adminToken");
    const response = await axios.put<EditOrganiser>(
      `${API_BASE_URL}/organiser/${organiserId}`,formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data
    
  } catch (error) {

  const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
    
  }
 




}

export const organiserBlock=async(organiser:Organiser):Promise<EditOrganiser>=>{
  try {
    const token=localStorage.getItem("adminToken");
    const response = await axios.put(
      `${API_BASE_URL}/organiser`,organiser,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data


    
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
    
  }


}
export const getAllUsers=async()=>{
  try {
    const token=localStorage.getItem("adminToken");
    const response = await axios.get<GetUsers>(
      `${API_BASE_URL}/users`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
   
    
    return response.data

   
    
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
    
  }



}
export const updateUser=async(id:string,formData:Omit<User, '_id'>):Promise<EditUser>=>{
  try {
    const token=localStorage.getItem("adminToken");
    const response = await axios.put<EditUser>(
      `${API_BASE_URL}/user/${id}`,formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data
    
  } catch (error) {

  const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
    
  }

}
export const blockUser=async(user:IUser)=>{
  try {
    const token=localStorage.getItem("adminToken");
    const response = await axios.put(
      `${API_BASE_URL}/user`,user,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data


    
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
    
  }


}
export const getAllEvents=async()=>{
  try {
    const token=localStorage.getItem("adminToken");
    const response = await axios.get<GetEvents>(
      
      
      `${API_BASE_URL}/events`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
   
    
    return response.data

   
    
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
    
  }

}
export const updateEvent=async(id:string,formData:EventEdit):Promise<EditEvent>=>{
  try {
    const token=localStorage.getItem("adminToken");
    console.log("form",formData);
    
    const response = await axios.put<EditEvent>(
      `${API_BASE_URL}/event/${id}`,formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data
    
  } catch (error) {

  const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
    
  }

}

export const blockEvent=async(event:IEventDTO):Promise<EditEvent>=>{
  try {
    const token=localStorage.getItem("adminToken");
    const response = await axios.put(
      `${API_BASE_URL}/event`,event,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
   
    
    return response.data


    
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
    
  }


}
export const adminRepository={
  adminLogin,
  getAllOrganisers,
  updateOrganiser,
  
 organiserBlock,
 getAllUsers,
 updateUser,
 blockUser,
 getAllEvents,
 updateEvent,
 blockEvent

}