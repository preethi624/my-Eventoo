import type { CredentialResponse } from "@react-oauth/google";
import type { Credentials} from "../../assets/pages/Login";
//import { authRepository } from "../../repositories/authRepositories"
import {  organiserLoginSuccess, userLoginSuccess} from "../slices/authSlices";
import type { AppDispatch } from "../stroe";
import { authRepository } from "../../repositories/authRepositories";




export const loginUser=(credentials:Credentials)=>async(dispatch:AppDispatch)=>{
    try {
       
        
        const data= await authRepository.loginUser(credentials);
       
        
        
        
        
        if(data.success){
            dispatch(userLoginSuccess(data.accessToken));
        
        
            return {success:true,token:data.accessToken}
        
        } else{
            return{success:false,message:data.message}
        }
        
       
        
    } catch (error) {
        console.error("userLogin failed",error);
        return {error,success:false}
        
        
    }
}
export const loginOrganiser=(credentials:Credentials)=>async(dispatch:AppDispatch)=>{
    try {
       
        
        const data= await authRepository.loginOrganiser(credentials);

       
        
      
        
       
        
        dispatch(organiserLoginSuccess(data.accessToken));
        
        
        return {success:true,token:data.accessToken}
        
    } catch (error) {
        console.error("organiserLogin failed",error);
        return {error,success:false}
        
        
    }
}
export const loginUserWithGoogle=(credentialResponse:CredentialResponse)=>async(dispatch:AppDispatch)=>{
    try {
        
        
        const data=await authRepository.loginUserWithGoogle(credentialResponse);
    
        
        
        dispatch(userLoginSuccess(data.token));
        return {success:true,token:data.token}
    } catch (error) {
        return {error,success:false}
        
    }
}
export const loginOrganiserWithGoogle=(credentialResponse:CredentialResponse)=>async(dispatch:AppDispatch)=>{
    try {
        
        
        const data=await authRepository.loginOrganiserWithGoogle(credentialResponse);
 
        
      
        
        
        dispatch(organiserLoginSuccess(data.token));
        return {success:true,token:data.token,message:data.message}
    } catch (error) {
        return {error,success:false}
        
    }
}



