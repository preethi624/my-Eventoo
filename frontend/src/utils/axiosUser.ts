import axios, { AxiosError } from 'axios';
import type {
  AxiosHeaders,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

function isOrganiserRoute(url: string | undefined): boolean {
  return (
    url?.includes('/organiser') ||
    url?.includes('/event/createEvent') ||
    url?.includes('/event/event') ||
    url?.includes('/event/deleteEvent') ||
    url?.includes('/event/events') ||
    url?.includes('/event')||
    url?.includes('/payment')||
    url?.includes('/orgOrder')||
    url?.includes('/organiser/venues')||
    url?.includes('/organiser/order')||

    
    false
  );
}

axiosInstance.interceptors.request.use(
  (config: CustomAxiosRequestConfig): CustomAxiosRequestConfig => {
   
    const token = isOrganiserRoute(config.url)
      ? localStorage.getItem('organiserToken')
      : localStorage.getItem('userToken');

    if (token) {
   
     
      
      config.headers?.set?.('Authorization', `Bearer ${token}`);
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

      const isOrganiser = isOrganiserRoute(originalRequest.url);

      try {
        const response = await axios.get(
          'http://localhost:3000/api/auth/refresh',
          {
            withCredentials: true,
          }
        );

        const token = response.data.token;

        // Store in correct token bucket
        if (isOrganiser) {
          localStorage.setItem('organiserToken', token);
        } else {
          localStorage.setItem('userToken', token);
        }

      if (!originalRequest.headers) {
  originalRequest.headers = new axios.AxiosHeaders();
}

(originalRequest.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`);




        return axiosInstance(originalRequest);
      } catch (refreshError) {
        if (isOrganiser) {
          localStorage.removeItem('organiserToken');
        } else {
          localStorage.removeItem('userToken');
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
