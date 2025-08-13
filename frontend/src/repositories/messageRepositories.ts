

const API_BASE_URL = `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/message`;

import { AxiosError } from "axios";
import axiosInstance from "../utils/axiosUser";

export const getMessages = async (organiserId: string, userId: string) => {
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/message/${organiserId}/${userId}`
    );

    if (response) {
      return response.data;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};

export const messageRepository = {
  getMessages,
};