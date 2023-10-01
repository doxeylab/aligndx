import axios from 'axios';
import getAxiosInstance from "../api/axiosSingleton";
import { BACKEND_URL } from "../config/Settings"

const axiosInstance = getAxiosInstance()
const refreshAxiosInstance = axios.create({ baseURL: BACKEND_URL });

export const getToken = (key: string): string | null => localStorage.getItem(key);
export const saveToken = (key: string, token: string): void => localStorage.setItem(key, token);
export const clearToken = (key: string): void => localStorage.removeItem(key);


function decodeToken(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );

  return JSON.parse(jsonPayload);
}

export const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }

  const decoded = decodeToken(accessToken);

  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

export const tokenExpired = (exp: number) => {
  // eslint-disable-next-line prefer-const
  let expiredTimer;

  const currentTime = Date.now();

  const timeLeft = exp * 1000 - currentTime;

  clearTimeout(expiredTimer);

  expiredTimer = setTimeout(() => {
    clearToken('accessToken');

  }, timeLeft);
};

// ----------------------------------------------------------------------

export const ACCESS_STORAGE_KEY = 'accessToken';

export const setSession = (key: string, token: string): void => {
  if (token) {
    saveToken(key, token);
    if (key === ACCESS_STORAGE_KEY) {
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
      // Handle when token is expired
      const { exp } = decodeToken(token);
      tokenExpired(exp);
    }
  } else {
    if (key === ACCESS_STORAGE_KEY) {
      delete axiosInstance.defaults.headers.common.Authorization;
    }
    clearToken(key);
  }
};


export const refreshAccessToken = async (): Promise<string> => {
  const response = await refreshAxiosInstance.get(`${BACKEND_URL}/users/refresh`,{withCredentials: true})
  const accessToken: string = response.data.access_token;

  if (!isValidToken(accessToken)) throw new Error("Invalid access token");

  setSession(ACCESS_STORAGE_KEY, accessToken);
  return accessToken;
};
