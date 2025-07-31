
import { AxiosError } from 'axios';



import axiosInstance from '../utils/axiosUser';
import type { GetUser, ProfileEdit, UserUpdate } from '../interfaces/IUser';

const API_BASE_URL="http://localhost:3000/api/user";

export const getUserById=async()=>{
  try {
    const response=await axiosInstance.get(`${API_BASE_URL}/user`);
    return response.data
    
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
    
    
  }
  


}
export const updateUser=async(FormData:FormData):Promise<UserUpdate>=>{
    try {
        const response=await axiosInstance.put(`${API_BASE_URL}/user`,FormData);
        console.log("repRes",response);
        
        if(response.data.success){
            return{result:response.data,success:true,message:"user updated successfully"}

        }else{
            return{success:false,message:"failed to update user"}
        }
        
    } catch (error) {

const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
    
        
    }


}
export const userRepository={
    getUserById,
    updateUser
}