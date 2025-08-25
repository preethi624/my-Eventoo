
import { AxiosError } from "axios";
import axiosInstance from "../utils/axiosUser";


const API_BASE_URL = `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/review`;
export const createReview=async(review:{rating:number,comment:string},eventId:string)=>{
    try {
        const response=await axiosInstance.post(
            `${API_BASE_URL}/${eventId}`,review

        )
        console.log("reee",response);
        
        if(response.data.success){
            return{success:true,message:"successfully created review"}
        }else{
            return{
                success:false,message:"failed to create review"
            }
        }
        
    } catch (error) {

         const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
    }

}
export const fetchReviews=async(eventId:string)=>{
    try {
        const response=await axiosInstance.get(
            `${API_BASE_URL}/${eventId}`

        ) 
        if(response.data.success){
            return response.data
        }
    
        
    } catch (error) {
        const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
        
    }
    

}






export const reviewRepository={
    createReview,
    fetchReviews,

}