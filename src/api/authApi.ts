import { axiosInstance } from './axiosInstance';
import type { TokenResponse } from './types';

export const authApi = {
  // Логин — /auth/token-generate
  login: (email: string, password: string) =>
    axiosInstance.post<TokenResponse>(
      '/auth/token-generate',
      { email, password },
      {
        headers: {
          'Content-Type': 'multipart/form-data', // Важно! В документации указано multipart/form-data
        },
      },
    ),

  // Рефреш — /auth/token-refresh
  refresh: (refreshToken: string) =>
    axiosInstance.post<TokenResponse>(
      '/auth/token-refresh',
      { refresh_token: refreshToken },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    ),

  // Профиль — для проверки авторизации
  getProfile: () => axiosInstance.get('/profile'),
};
