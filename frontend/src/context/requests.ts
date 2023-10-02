import { AxiosRequestConfig } from 'axios';
import getAxiosInstance from '../api/axiosSingleton';


const axiosInstance = getAxiosInstance()
export const endpoints = {
    auth: {
        me: 'users/me',
        refresh: 'users/refresh',
        signup: 'users/create_user',
        login: 'users/token',
        logout: 'users/logout',
    },
};

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
    const [url, config] = Array.isArray(args) ? args : [args];
    const res = await axiosInstance.get(url, { ...config });
    return res.data;
};

export const poster = async (url: string, data?: any, config?: AxiosRequestConfig) => {
  const res = await axiosInstance.post(url, data, config);
  return res.data;
};

export const posterForm = async (url: string, data?: any, config?: AxiosRequestConfig) => {
    const formParams = new URLSearchParams();
    for(const key in data) {
      formParams.append(key, data[key]);
    }
  
    const res = await axiosInstance.post(url, formParams.toString(), {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return res.data;
  };
  