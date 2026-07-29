import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { disconnectSocket } from './socket.service';

// Track if we're currently checking auth to prevent premature logout during init
let isCheckingAuth = false;

export function setAuthChecking(checking: boolean) {
  isCheckingAuth = checking;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message: string | string[]; statusCode: number }>) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

  if (status === 401) {
    // Don't remove token or redirect if we're still checking auth
    // Let AuthContext handle the error
    if (!isCheckingAuth) {
      Cookies.remove('token');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        toast.error('Session expired. Please log in again.');
        disconnectSocket();
        window.location.href = '/login';
      }
    }
  } else if (status === 429) {
      toast.error('Too many requests. Please slow down.');
    } else if (status && status >= 500) {
      toast.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  },
);

export default api;