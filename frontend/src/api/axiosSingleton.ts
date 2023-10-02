import axios, { AxiosInstance } from 'axios';
import { BACKEND_URL } from "../config/Settings";
import { getToken, ACCESS_STORAGE_KEY, refreshAccessToken } from '../context/utils';

let axiosInstance: AxiosInstance | null = null;

function createAxiosInstance(): AxiosInstance {
  const instance = axios.create({ baseURL: BACKEND_URL });

  instance.interceptors.request.use(
    config => {
      const accessToken = getToken(ACCESS_STORAGE_KEY);
      if (accessToken) {
        config.headers = config.headers || {}; // Ensuring headers object is defined.
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    error => Promise.reject(error),
  );

  instance.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      
      // Check if the error status is 401 and not a retry request
      if (error.response?.status === 401 && !originalRequest._retry) {
        
        // Mark this request as a retry
        originalRequest._retry = true;
  
        try {
          // Attempt to refresh the access token
          const newAccessToken = await refreshAccessToken();
          
          // Update the Authorization header with the new access token
          originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
          
          // Retry the original request with the new access token
          return instance(originalRequest);
        } catch (refreshError) {
          // If token refresh fails, reject with the original error
          return Promise.reject(error);
        }
      }
      
      // For other errors or if retrying fails, reject with the original error
      return Promise.reject(error);
    },
  );
  

  return instance;
}

export default function getAxiosInstance(): AxiosInstance {
  if (!axiosInstance) {
    axiosInstance = createAxiosInstance();
  }
  return axiosInstance;
}
