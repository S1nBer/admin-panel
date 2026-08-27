import { call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { authApi } from '../../api/authApi';
import { loginRequest, loginSuccess, loginFailure, logout } from '../slices/authSlice';
import { message } from 'antd';
import type { AxiosError } from 'axios';
import type { SagaType } from './types';

function* loginSaga(action: ReturnType<typeof loginRequest>): SagaType {
  try {
    const { email, password } = action.payload;

    const response = (yield call(authApi.login, email, password)) as Awaited<
      ReturnType<typeof authApi.login>
    >;

    yield put(loginSuccess(response.data));
    yield put(push('/dashboard'));
    message.success('Добро пожаловать!');
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    let errorMessage = 'Ошибка авторизации';

    if (axiosError.response?.data?.message) {
      errorMessage = axiosError.response.data.message;
    } else if (axiosError.response?.status === 422) {
      errorMessage = 'Проверьте правильность введённых данных';
    } else if (axiosError.response?.status === 400) {
      errorMessage = 'Неверный email или пароль';
    }

    yield put(loginFailure(errorMessage));
    message.error(errorMessage);
  }
}

function* logoutSaga(): SagaType {
  yield put(logout());
  yield put(push('/login'));
  message.info('Вы вышли из системы');
}

export function* watchAuth(): SagaType {
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(logout.type, logoutSaga);
}
