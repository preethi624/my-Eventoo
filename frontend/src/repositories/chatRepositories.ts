import type { ChatbotResponse } from "../assets/components/Chatbot";
const API_BASE_URL = `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/chat`;
import { type AxiosResponse } from "axios";
import { AxiosError } from "axios";
import axiosInstance from "../utils/axiosUser";

export const createChat = async (message: string, userId: string) => {
  try {
    const response: AxiosResponse<ChatbotResponse> = await axiosInstance.post(
      `${API_BASE_URL}/chat`,
      { message, userId }
    );

    if (response) {
      return {
        success: true,
        message: "successfully chat",
        response: response.data,
      };
    } else {
      return { success: false, message: "something wrong" };
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};
export const chatbotRepository = {
  createChat,
};
