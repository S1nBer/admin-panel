import { call, put, takeLatest, select } from 'redux-saga/effects';
import { postsApi } from '../../api/postsApi';
import {
  fetchPostsRequest,
  fetchPostsSuccess,
  fetchPostsFailure,
  addPostRequest,
  addPostSuccess,
  addPostFailure,
  editPostRequest,
  editPostSuccess,
  editPostFailure,
  deletePostRequest,
  deletePostSuccess,
  deletePostFailure,
  fetchPostDetailRequest,
  fetchPostDetailSuccess,
  fetchPostDetailFailure,
} from '../slices/postsSlice';
import { message } from 'antd';
import type { AxiosError } from 'axios';
import type { SagaType } from './types';
import type { RootState } from '../../store/types';
import type { PaginationMeta, ValidationError } from '../../api/types';

function* fetchPostsSaga(action: ReturnType<typeof fetchPostsRequest>): SagaType {
  try {
    const { page, limit = 10 } = action.payload;
    // @ts-expect-error - redux-saga call types не дружат с методами объектов
    const response = (yield call(postsApi.getPosts, page, limit)) as Awaited<
      ReturnType<typeof postsApi.getPosts>
    >;
    yield put(fetchPostsSuccess(response));
  } catch (error) {
    const axiosError = error as AxiosError;

    yield put(fetchPostsFailure(axiosError.message || 'Ошибка загрузки постов'));
    message.error('Не удалось загрузить посты');
  }
}

function* fetchPostDetailSaga(action: ReturnType<typeof fetchPostDetailRequest>): SagaType {
  try {
    const response = (yield call(postsApi.getPostDetail, action.payload)) as Awaited<
      ReturnType<typeof postsApi.getPostDetail>
    >;

    yield put(fetchPostDetailSuccess(response.data));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки поста';

    yield put(fetchPostDetailFailure(errorMessage));
    message.error('Не удалось загрузить данные поста');
  }
}

function* addPostSaga(action: ReturnType<typeof addPostRequest>): SagaType {
  try {
    yield call(postsApi.addPost, action.payload);
    yield put(addPostSuccess());
    message.success('Пост добавлен');

    const pagination = (yield select(
      (state: RootState) => state.posts.pagination,
    )) as PaginationMeta;

    yield put(fetchPostsRequest({ page: pagination.current, limit: pagination.limit }));
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string } | ValidationError[]>;

    if (axiosError.response?.status === 422) {
      const errors = axiosError.response.data as ValidationError[];

      yield put(addPostFailure(JSON.stringify(errors)));
      message.error('Проверьте правильность заполнения полей');

      return;
    }

    const errorData = axiosError.response?.data;
    const errorMessage =
      errorData && !Array.isArray(errorData) && 'message' in errorData && errorData.message
        ? errorData.message
        : 'Ошибка добавления поста';

    yield put(addPostFailure(errorMessage));
    message.error(errorMessage);
  }
}

function* editPostSaga(action: ReturnType<typeof editPostRequest>): SagaType {
  try {
    const { id, data } = action.payload;

    yield call(postsApi.editPost, id, data);
    yield put(editPostSuccess());
    message.success('Пост обновлён');

    const pagination = (yield select(
      (state: RootState) => state.posts.pagination,
    )) as PaginationMeta;

    yield put(fetchPostsRequest({ page: pagination.current, limit: pagination.limit }));
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || 'Ошибка обновления поста';

    yield put(editPostFailure(errorMessage));
    message.error(errorMessage);
  }
}

function* deletePostSaga(action: ReturnType<typeof deletePostRequest>): SagaType {
  try {
    yield call(postsApi.deletePost, action.payload);
    yield put(deletePostSuccess());
    message.success('Пост удалён');

    const pagination = (yield select(
      (state: RootState) => state.posts.pagination,
    )) as PaginationMeta;

    yield put(fetchPostsRequest({ page: pagination.current, limit: pagination.limit }));
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || 'Ошибка удаления поста';

    yield put(deletePostFailure(errorMessage));
    message.error(errorMessage);
  }
}

export function* watchPosts(): SagaType {
  yield takeLatest(fetchPostsRequest.type, fetchPostsSaga);
  yield takeLatest(fetchPostDetailRequest.type, fetchPostDetailSaga);
  yield takeLatest(addPostRequest.type, addPostSaga);
  yield takeLatest(editPostRequest.type, editPostSaga);
  yield takeLatest(deletePostRequest.type, deletePostSaga);
}
