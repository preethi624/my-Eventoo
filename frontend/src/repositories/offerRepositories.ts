import { AxiosError } from "axios";
import axiosInstance from "../utils/axiosUser";


const API_BASE_URL = `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/offer`;
export const fetchOffers=async(filters:string)=>{
    try {
        const response=await axiosInstance.get(`${API_BASE_URL}/?${filters}`)
        if(response.data.success){
            return response.data
        }
    
        
        
    } catch (error) {
          const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
        
    }

}
export const fetchOfferById=async(offerId:string)=>{
    try {
        const response=await axiosInstance.get(`${API_BASE_URL}/${offerId}`);
        if(response){
            return response.data
        }
        
    } catch (error) {
          const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
        
    }

}






export const offerRepository={
  fetchOffers,
  fetchOfferById
}