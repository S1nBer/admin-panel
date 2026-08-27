import { call, put, takeLatest } from 'redux-saga/effects';
import type { SagaType } from './types';
import { authorsApi } from '../../api/authorsApi';
import {
  fetchAuthorsRequest,
  fetchAuthorsSuccess,
  fetchAuthorsFailure,
  addAuthorRequest,
  addAuthorSuccess,
  addAuthorFailure,
  editAuthorRequest,
  editAuthorSuccess,
  editAuthorFailure,
  deleteAuthorRequest,
  deleteAuthorSuccess,
  deleteAuthorFailure,
} from '../slices/authorsSlice';
import { message } from 'antd';
import type { AxiosError } from 'axios';

function* fetchAuthorsSaga(): SagaType {
  try {
    const response = (yield call(authorsApi.getAuthors)) as Awaited<
      ReturnType<typeof authorsApi.getAuthors>
    >;
    yield put(fetchAuthorsSuccess(response.data));
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    yield put(fetchAuthorsFailure(err.message || 'Ошибка загрузки авторов'));
    message.error('Не удалось загрузить авторов');
  }
}

function* addAuthorSaga(action: ReturnType<typeof addAuthorRequest>): SagaType {
  try {
    yield call(authorsApi.addAuthor, action.payload);
    yield put(addAuthorSuccess());
    message.success('Автор добавлен');
    yield put(fetchAuthorsRequest());
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    const errorMessage = err.response?.data?.message || 'Ошибка добавления автора';
    yield put(addAuthorFailure(errorMessage));
    message.error(errorMessage);
  }
}

function* editAuthorSaga(action: ReturnType<typeof editAuthorRequest>): SagaType {
  try {
    const { id, data } = action.payload;
    yield call(authorsApi.editAuthor, id, data);
    yield put(editAuthorSuccess());
    message.success('Автор обновлён');
    yield put(fetchAuthorsRequest());
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    const errorMessage = err.response?.data?.message || 'Ошибка обновления автора';
    yield put(editAuthorFailure(errorMessage));
    message.error(errorMessage);
  }
}

function* deleteAuthorSaga(action: ReturnType<typeof deleteAuthorRequest>): SagaType {
  try {
    yield call(authorsApi.deleteAuthor, action.payload);
    yield put(deleteAuthorSuccess());
    message.success('Автор удалён');
    yield put(fetchAuthorsRequest());
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    const errorMessage = err.response?.data?.message || 'Ошибка удаления автора';
    yield put(deleteAuthorFailure(errorMessage));
    message.error(errorMessage);
  }
}

export function* watchAuthors(): SagaType {
  yield takeLatest(fetchAuthorsRequest.type, fetchAuthorsSaga);
  yield takeLatest(addAuthorRequest.type, addAuthorSaga);
  yield takeLatest(editAuthorRequest.type, editAuthorSaga);
  yield takeLatest(deleteAuthorRequest.type, deleteAuthorSaga);
}
