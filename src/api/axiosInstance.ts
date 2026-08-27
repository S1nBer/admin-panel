import axios from 'axios';
import { store } from '../store';
import { refreshTokenSuccess, logout } from '../store/slices/authSlice';
import { authApi } from './authApi';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://rest-test.machineheads.ru';

interface FailedQueueItem {
  resolve: (value: string) => void;
  reject: (reason?: unknown) => void;
}

export const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерсептор для добавления токена (читаем из sessionStorage)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Интерсептор для рефреша (без изменений, только читаем refresh из sessionStorage)
let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: unknown | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = sessionStorage.getItem('refreshToken');

      if (!refreshToken) {
        store.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await authApi.refresh(refreshToken);
        const newToken = response.data.access_token;

        store.dispatch(refreshTokenSuccess(response.data));

        axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(logout());
        window.location.href = '/login';

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
