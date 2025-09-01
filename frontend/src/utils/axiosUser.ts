
import axios, { AxiosError } from "axios";
import type {
  AxiosHeaders,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_BASE_URL,
  withCredentials: true,
});


axiosInstance.interceptors.request.use(
  (config: CustomAxiosRequestConfig): CustomAxiosRequestConfig => {
    const token = localStorage.getItem("authToken"); //
    if (token) {
      config.headers?.set?.("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
       
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/auth/refresh`,
          { withCredentials: true }
        );

        const token = response.data.token;

       
        localStorage.setItem("authToken", token);

        if (!originalRequest.headers) {
          originalRequest.headers = new axios.AxiosHeaders();
        }
        (originalRequest.headers as AxiosHeaders).set(
          "Authorization",
          `Bearer ${token}`
        );

        return axiosInstance(originalRequest); 
      } catch (refreshError) {
        
        localStorage.removeItem("authToken");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
