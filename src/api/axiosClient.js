import axios from 'axios';
import { logout } from '../redux/slices/authSlice';
import { store } from '../redux/store';

// Base API URL - Configure via .env file or default
const BASE_URL = import.meta.env.VITE_API_URL;

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// ----------------------------------------------------------------------
// 1. Request Interceptor: Attach Auth Token
// ----------------------------------------------------------------------
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('finora_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ----------------------------------------------------------------------
// 2. Response Interceptor: Global Error Handling & Refresh Token Logic
// ----------------------------------------------------------------------
axiosClient.interceptors.response.use(
  (response) => response.data, // Returns data directly (cleaner API calls)
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (Expired Token)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('finora_refresh_token');

        if (refreshToken) {
          // Request new access token from backend
          const res = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken });
          const { accessToken } = res.data;

          // Save new token and retry original request
          localStorage.setItem('finora_token', accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosClient(originalRequest);
        } else {
          // Refresh token failed -> Clear storage & redirect to login
          localStorage.removeItem('finora_token');
          localStorage.removeItem('finora_refresh_token');
          store.dispatch(logout());
          window.location.href = '/login';
        }
      } catch (refreshError) {
        // Refresh token failed -> Clear storage & redirect to login
        localStorage.removeItem('finora_token');
        localStorage.removeItem('finora_refresh_token');
        store.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Format readable error message
    const customError = {
      message: error.response?.data?.message || 'Something went wrong. Please try again.',
      status: error.response?.status,
    };

    return Promise.reject(customError);
  }
);

export default axiosClient;