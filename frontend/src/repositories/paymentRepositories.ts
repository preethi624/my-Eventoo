
import { AxiosError } from 'axios';
import type {   OrderCreateInput, RazorpayPaymentResponse, UserProfile } from '../interfaces/IPayment';
import axiosInstance from '../utils/axiosUser';
import type { IGetOrdersResponse } from '../interfaces/IOrder';


const API_BASE_URL="http://localhost:3000/api/payment";
export const createOrder=async(data:OrderCreateInput)=>{
    try {
     
      
    const response=await axiosInstance.post(`${API_BASE_URL}/order`,data);
   
    
   if(response.data&&response.data.success){
      return response.data

    }else{
      return{success:true,message:"failed to create order"}
    }  

        
    } catch (error) {
         const axiosError = error as AxiosError;
            throw axiosError.response?.data || axiosError.message;
            
        
    }

   

}
export const verifyPayment=async(paymentResponse:RazorpayPaymentResponse)=>{
  try {
   
  const response=await axiosInstance.post(`${API_BASE_URL}/verify`,paymentResponse)
  if(response.data&&response.data.success){
    return {success:true,message:"payment verified successfully"}
  }else{
    return {success:false,message:"Payment verification fails"}
  }
    
  } catch (error) {
      const axiosError = error as AxiosError;
            throw axiosError.response?.data || axiosError.message; 

    
  }

  

}
export const failurePayment=async(payStatus:string,orderId:string,userId:string)=>{
  try {
     const response=await axiosInstance.post(`${API_BASE_URL}/failure`,{payStatus,orderId,userId});
     console.log('orderId',orderId);
     
      if(response.data&&response.data.success){
    return {success:true,message:"status updated successfully"}
  }else{
    return {success:false,message:"Payment status updation  fails"}
  }
    
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message; 

    
  }
 

}
export const getOrders=async(userId:string,currentPage:number,limit:number,queryParams:string):Promise<IGetOrdersResponse>=>{
  try {
   
    
    
  const response=await axiosInstance.get(`${API_BASE_URL}/orders/${userId}?limit=${limit}&page=${currentPage}&${queryParams}`);

  
  if(response.data&&response.data.success){
    return {success:true,message:"order got successfully",order:response.data.order}
  }else{
    return {success:false,message:"Failed to fetch order"}
  }
    
  } catch (error) {
      const axiosError = error as AxiosError;
            throw axiosError.response?.data || axiosError.message; 

    
  }

}
export const getOrderDetails=async(orderId:string,userId:string)=>{
  try {
    const response=await axiosInstance.get(`${API_BASE_URL}/order/${userId}/${orderId}`);
     if(response.data&&response.data.success){
    return {success:true,message:"order got successfully",order:response.data.order}
  }else{
    return {success:false,message:"Failed to fetch order"}
  }
    
  } catch (error) {
    const axiosError = error as AxiosError;
            throw axiosError.response?.data || axiosError.message; 

    
  }


}
export const getEventBooked=async(userId:string):Promise<UserProfile>=>{
  try {

 const response=await axiosInstance.get(`${API_BASE_URL}/order/${userId}`);
 if(response){
  return {totalSpent:response.data.totalSpent,eventsBooked:response.data.eventsBooked,success:true}
 }else{
  return{success:false}


 }
    
  } catch (error) {
    const axiosError = error as AxiosError;
            throw axiosError.response?.data || axiosError.message; 

    
  }
}


export const paymentRepository={
  createOrder,
  verifyPayment,
  getOrders,
  getOrderDetails,
  failurePayment,
  getEventBooked,

}
