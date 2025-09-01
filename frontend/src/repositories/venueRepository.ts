import { AxiosError } from "axios";
import axiosInstance from "../utils/axiosUser";


const API_BASE_URL = `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/venue`;
export const fetchVenues=async()=>{
    try {
        const response=await axiosInstance.get(
            `${API_BASE_URL}`

        ) 
        if(response.data.success){
            return response.data
        }
    
        
    } catch (error) {
        const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
        
    }
    

}
export const venueRepositories={
    fetchVenues
}