import axios from 'axios';
import { AxiosError } from 'axios';





import type { IOrganiser } from '../interfaces/IOrganiser';
import axiosInstance from '../utils/axiosUser';
import type { FetchOrders, OrgOrder } from '../interfaces/IPayment';
const API_BASE_URL="http://localhost:3000/api/organiser";
interface GetOrganiserById{
  success?:boolean;
  result:IOrganiser;
  message?:string
}

export const getOrganiserById=async(id:string):Promise<GetOrganiserById>=>{
  try {
    
    
    
   
    const response=await axiosInstance.get<GetOrganiserById>(
      `${API_BASE_URL}/organiser/${id}`
       
      
      
    )
   
    
  
    
 
   
    
    return response.data
    
  } catch (error) {

    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
    
  }

  
}
export const checkStatus=async(email:string)=>{
  try {
   
    
   
    
    const token=localStorage.getItem('organiserToken');
    const response=await axios.post(`${API_BASE_URL}/checkStatus`,{email}, {
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
export const updateOrganiser=async(formData:FormData,organiserId:string)=>{
try {
   const response=await axiosInstance.put(`${API_BASE_URL}/organiser/${organiserId}`,formData);
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
export const fetchBookings=async(organiserId:string,page:number,limit:number):Promise<FetchOrders>=>{
  try {
    
    
    
    

 const response=await axiosInstance.get(`${API_BASE_URL}/orgOrder/${organiserId}?limit=${limit}&page=${page}`);
 
 
 if(response){
  return {result:response.data.result,currentPage:response.data.currentPage,totalPages:response.data.totalPages,success:true}
 }else{
  return{success:false}


 }
    
  } catch (error) {
    const axiosError = error as AxiosError;
            throw axiosError.response?.data || axiosError.message; 

    
  }
}
export const getOrderDetails=async(orderId:string):Promise<OrgOrder>=>{
  try {
  
    
   
    
    
    
    
    

 const response=await axiosInstance.get(`${API_BASE_URL}/orgOrders/${orderId}`);
 console.log("responseDetails",response);
 
 if(response){
  return {order:response.data.order,success:true,message:"order fetched success"}
 }else{
  return{success:false,message:"failed"}


 }
    
  } catch (error) {
    const axiosError = error as AxiosError;
            throw axiosError.response?.data || axiosError.message; 

    
  }
}
export const reapply=async(organiserId:string)=>{
  try {

    const response=await axiosInstance.post(`${API_BASE_URL}/organiserReapply/${organiserId}`);
    if(response.data.success){
      return {success:true,message:"reapplied successfully"}
    }else{
      return{success:false,message:"failed to reapply"}
    }
    
   
    
    
      
      
      return response.data
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
    
  }


}
export const organiserRepository={
    getOrganiserById,
    checkStatus,
    updateOrganiser,
    fetchBookings,
    getOrderDetails,
    reapply

 
  
}