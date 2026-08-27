import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TokenResponse } from '../../api/types';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  accessExpiredAt: number | null;
}

// Хелпер для чтения токена из sessionStorage с проверкой на истечение
const getTokenFromStorage = (): {
  accessToken: string | null;
  refreshToken: string | null;
  accessExpiredAt: number | null;
  isAuthenticated: boolean;
} => {
  const accessToken = sessionStorage.getItem('accessToken');
  const refreshToken = sessionStorage.getItem('refreshToken');
  const accessExpiredAt = sessionStorage.getItem('accessExpiredAt');

  if (!accessToken || !refreshToken || !accessExpiredAt) {
    return { accessToken: null, refreshToken: null, accessExpiredAt: null, isAuthenticated: false };
  }

  const expiredAt = parseInt(accessExpiredAt, 10);
  const now = Math.floor(Date.now() / 1000);

  // Если токен истёк — удаляем всё
  if (expiredAt < now) {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('accessExpiredAt');

    return { accessToken: null, refreshToken: null, accessExpiredAt: null, isAuthenticated: false };
  }

  return {
    accessToken,
    refreshToken,
    accessExpiredAt: expiredAt,
    isAuthenticated: true,
  };
};

const storageData = getTokenFromStorage();

const initialState: AuthState = {
  accessToken: storageData.accessToken,
  refreshToken: storageData.refreshToken,
  isAuthenticated: storageData.isAuthenticated,
  loading: false,
  error: null,
  accessExpiredAt: storageData.accessExpiredAt,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loginRequest: (state, _action: PayloadAction<{ email: string; password: string }>) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<TokenResponse>) => {
      state.loading = false;
      state.accessToken = action.payload.access_token;
      state.refreshToken = action.payload.refresh_token;
      state.accessExpiredAt = action.payload.access_expired_at;
      state.isAuthenticated = true;

      sessionStorage.setItem('accessToken', action.payload.access_token);
      sessionStorage.setItem('refreshToken', action.payload.refresh_token);
      sessionStorage.setItem('accessExpiredAt', String(action.payload.access_expired_at));
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.accessExpiredAt = null;

      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('accessExpiredAt');
    },
    refreshTokenSuccess: (state, action: PayloadAction<TokenResponse>) => {
      state.accessToken = action.payload.access_token;
      state.refreshToken = action.payload.refresh_token;
      state.accessExpiredAt = action.payload.access_expired_at;
      state.isAuthenticated = true;

      sessionStorage.setItem('accessToken', action.payload.access_token);
      sessionStorage.setItem('refreshToken', action.payload.refresh_token);
      sessionStorage.setItem('accessExpiredAt', String(action.payload.access_expired_at));
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout, refreshTokenSuccess, clearError } =
  authSlice.actions;

export default authSlice.reducer;
