import type { AxiosError } from "axios";
import axiosInstance from "../utils/axiosUser";
const API_BASE_URL="http://localhost:3000/api/category";

export const getCategories= async () => {
  try {
    
  
    
    
    
    
    
    const response = await axiosInstance.get(
      `${API_BASE_URL}/categories`
    );
    
  
    
  
   
    
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const categoryRepository={
    getCategories,
}