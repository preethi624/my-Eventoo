import type { ChatbotResponse } from "../assets/components/Chatbot";
const API_BASE_URL="http://localhost:3000/api/chat";
import { type AxiosResponse } from 'axios';
import { AxiosError } from 'axios';
import axiosInstance from "../utils/axiosUser";


export const createChat=async(message:string)=>{
    try {
        
       
        
        const response:AxiosResponse<ChatbotResponse>=await axiosInstance.post(`${API_BASE_URL}/chat`,{message}
        )
       
        
        if(response){
            return{success:true,message:"successfully chat",response:response.data}

        }else{
            return {success:false,message:"something wrong"}
        }
        
    } catch (error) {
        const axiosError = error as AxiosError;
            throw axiosError.response?.data || axiosError.message;
        
    }



}
export const chatbotRepository={
    createChat

}