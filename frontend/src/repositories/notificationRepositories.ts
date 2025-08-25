import { AxiosError } from "axios";
import axiosInstance from "../utils/axiosUser";


const API_BASE_URL = `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/notification`;
export const fetchNotification=async()=>{
    try {
       const response=await axiosInstance.get(
            `${API_BASE_URL}`

        ) 
        console.log("reponse noti",response);
        
      if(response.data.success){
            return response.data
        }
    
        
        
    } catch (error) {

        const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
    }

}
export const markRead=async(id:string)=>{
    try {
       const response=await axiosInstance.post(
        `${API_BASE_URL}/${id}`
    )
    console.log("not up",response);
    
    if(response.data.success){
        return{success:true}
    }else{
        return {success:false}
    } 
        
    } catch (error) {
        const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
        
    }
    

}
export const notificationRepository={
    fetchNotification,
    markRead,

}