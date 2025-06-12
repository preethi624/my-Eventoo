import axios from 'axios';
import type { Credentials } from '../assets/pages/Login';

import type { ResendPayload, VerifyOtpUser } from '../assets/pages/VerifyOtpUser';
//import { VerifyOtpOrgPayload } from '../assets/pages/VerifyOtpOrg';
import type { CredentialResponse } from "@react-oauth/google";
import type { SignupCred } from '../assets/pages/Signup';
import type { VerifyOtpOrgPayload } from '../assets/pages/VerifyOtpOrg';

const API_BASE_URL="http://localhost:3000/api/auth";
interface ApiResponse{
    success:boolean;
    message:string;
}
interface VerifyOtp{
    email:string;
    otp:string;
    userType:string|null
}
interface ResetPass{
    email:string;
    password:string;
    userType?:string;
}

const loginUser=async(credentials:Credentials)=>{
    try {
        const response=await axios.post(`${API_BASE_URL}/user/login`,credentials);
        
        
        
        
      
      
        
       
        
       
     
       
    return response.data

        
    } catch (error:unknown) {
        console.log(error);
        
        if (axios.isAxiosError(error)) {
            const message = (error.response?.data?.message || error.message||"An unknown error occurred") as string;
            console.log("mes",message);
            
            return { success: false, message };
        }
        return { success: false, message: "An unexpected error occurred" };
        
    }
        
}
const loginOrganiser=async(credentials:Credentials)=>{
    try {
        const response=await axios.post(`${API_BASE_URL}/organiser/login`,credentials);
        console.log("resee",response);
        
       
        
       
     
       
    return response.data

        
    } catch (error:unknown) {
        if (axios.isAxiosError(error)) {
           
            throw error.response?.data || error.message;
        }
       
        throw new Error("An unexpected error occurred");
    }
        
}
const registerUser=async(credentials:SignupCred):Promise<ApiResponse>=>{
    try {
       
        const response=await axios.post(`${API_BASE_URL}/user/register`,credentials);
        console.log("resee",response);
        
      
        
        
        
        return response.data
        
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = (error.response?.data?.message || error.message||"An unknown error occurred") as string;
            return { success: false, message };
        }
        return { success: false, message: "An unexpected error occurred" };
        
    }
    
   


}
const registerOrganiser=async(credentials:SignupCred):Promise<ApiResponse>=>{

try {
   
    
        const response=await axios.post(`${API_BASE_URL}/organiser/register`,credentials);
      
        
        return response.data
        
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = (error.response?.data?.message || error.message||"An unknown error occurred") as string;
            return { success: false, message };
        }
        return { success: false, message: "An unexpected error occurred" };
        
    }

}
const verifyOtpUser=async(credentials:VerifyOtpUser):Promise<ApiResponse>=>{
    try {
        console.log("cred",credentials);
        
        
        
        const response=await axios.post(`${API_BASE_URL}/user/otp`,credentials);
    ;
        
        return response.data
        
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = (error.response?.data?.message || error.message||"An unknown error occurred") as string;
            return { success: false, message };
        }
        return { success: false, message: "An unexpected error occurred" };
        
    }
  

}
const resendOtp=async({email}:ResendPayload):Promise<ApiResponse>=>{
    try {
      
        
        const response=await axios.post(`${API_BASE_URL}/user/resendOtp`,{email});
        
        return response.data
        
    } catch (error) {

         if (axios.isAxiosError(error)) {
            const message = (error.response?.data?.message || error.message||"An unknown error occurred") as string;
            return { success: false, message };
        }
        return { success: false, message: "An unexpected error occurred" };
    }

}
const verifyOtpOrganiser=async(credentials:VerifyOtpOrgPayload):Promise<ApiResponse>=>{
    try {
        const response=await axios.post(`${API_BASE_URL}/organiser/otp`,credentials);
        return response.data
        
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = (error.response?.data?.message || error.message||"An unknown error occurred") as string;
            return { success: false, message };
        }
        return { success: false, message: "An unexpected error occurred" };
        
    }

}
const forgotPassword=async(credential:ResendPayload):Promise<ApiResponse>=>{
    try {
        
        

        const response=await axios.post(`${API_BASE_URL}/forgotPassword`,credential);
        return response.data

        
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = (error.response?.data?.message || error.message||"An unknown error occurred") as string;
            return { success: false, message };
        }
        return { success: false, message: "An unexpected error occurred" };
    }

}
const verifyOTP=async(credentials:VerifyOtp):Promise<ApiResponse>=>{
    try {
       
        
        const response=await axios.post(`${API_BASE_URL}/verifyOtp`,credentials);
        return response.data
        
    } catch (error) {

        if (axios.isAxiosError(error)) {
            const message = (error.response?.data?.message || error.message||"An unknown error occurred") as string;
            return { success: false, message };
        }
        return { success: false, message: "An unexpected error occurred" }; 
    }

}
const resendOTP=async(credentials:ResendPayload):Promise<ApiResponse>=>{
    try {
        console.log(credentials);
        
        const response=await axios.post(`${API_BASE_URL}/resendOTP`,credentials)

    return response.data
        
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = (error.response?.data?.message || error.message||"An unknown error occurred") as string;
            return { success: false, message };
        }
        return { success: false, message: "An unexpected error occurred" }; 
        
    }
    

}
const resetPassword=async(credentials:ResetPass):Promise<ApiResponse>=>{
    try {
        const response=await axios.post(`${API_BASE_URL}/resetPassword`,credentials);
        return response.data
        
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = (error.response?.data?.message || error.message||"An unknown error occurred") as string;
            return { success: false, message };
        }
        return { success: false, message: "An unexpected error occurred" }; 
        
        
    }

}
const loginUserWithGoogle=async(credentials:CredentialResponse)=>{
    try {
        const response = await axios.post(
            `${API_BASE_URL}/google/user`, 
            credentials,{
                withCredentials:true
            }
            
        );
        console.log("res",response);
        
      
        

        if (response.data.token) {
            localStorage.setItem('userToken', response.data.token);
        }

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = (error.response?.data?.message || error.message||"An unknown error occurred") as string;
            return { success: false, message };
        }
        return { success: false, message: "An unexpected error occurred" }; 
        
    }
   
}

const loginOrganiserWithGoogle=async(credentials:CredentialResponse)=>{
    try {
        const response = await axios.post(
            `${API_BASE_URL}/google/organiser`, 
            credentials,
            
        );
        console.log("response",response);
        

        if (response.data.token) {
            localStorage.setItem('organiserToken', response.data.token);
        }

        return response.data;
    } catch (error) {
        console.log("error",error);
        
        if (axios.isAxiosError(error)) {
            const message = (error.response?.data?.message || error.message||"An unknown error occurred") as string;
            return { success: false, message };
        }
        return { success: false, message: "An unexpected error occurred" }; 
        
    }
   
}

    




export const authRepository={
    loginUser,
    loginOrganiser,
    registerUser,
    registerOrganiser,
    verifyOtpUser,
    resendOtp,
    verifyOtpOrganiser,
    forgotPassword,
    verifyOTP,
    resendOTP,
    resetPassword,
   loginUserWithGoogle,
   loginOrganiserWithGoogle
    

}