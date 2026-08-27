import { call, put, takeLatest } from 'redux-saga/effects';
import { tagsApi } from '../../api/tagsApi';
import {
  fetchTagsRequest,
  fetchTagsSuccess,
  fetchTagsFailure,
  addTagRequest,
  addTagSuccess,
  addTagFailure,
  deleteTagRequest,
  deleteTagSuccess,
  deleteTagFailure,
  editTagRequest,
  editTagSuccess,
  editTagFailure,
} from '../slices/tagsSlice';
import { message } from 'antd';
import type { AxiosError } from 'axios';
import type { SagaType } from './types';

function* fetchTagsSaga(): SagaType {
  try {
    const response = (yield call(tagsApi.getTags)) as Awaited<ReturnType<typeof tagsApi.getTags>>;

    yield put(fetchTagsSuccess(response.data));
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || 'Ошибка загрузки тегов';

    yield put(fetchTagsFailure(errorMessage));
    message.error('Не удалось загрузить теги');
  }
}

function* addTagSaga(action: ReturnType<typeof addTagRequest>): SagaType {
  try {
    yield call(tagsApi.addTag, action.payload);
    yield put(addTagSuccess());
    message.success('Тег добавлен');
    yield put(fetchTagsRequest());
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || 'Ошибка добавления тега';

    yield put(addTagFailure(errorMessage));
    message.error(errorMessage);
  }
}

function* editTagSaga(action: ReturnType<typeof editTagRequest>): SagaType {
  try {
    const { id, data } = action.payload;

    yield call(tagsApi.editTag, id, data);
    yield put(editTagSuccess());
    message.success('Тег обновлён');
    yield put(fetchTagsRequest());
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || 'Ошибка обновления тега';

    yield put(editTagFailure(errorMessage));
    message.error(errorMessage);
  }
}

function* deleteTagSaga(action: ReturnType<typeof deleteTagRequest>): SagaType {
  try {
    yield call(tagsApi.deleteTag, action.payload);
    yield put(deleteTagSuccess());
    message.success('Тег удалён');
    yield put(fetchTagsRequest());
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || 'Ошибка удаления тега';

    yield put(deleteTagFailure(errorMessage));
    message.error(errorMessage);
  }
}

export function* watchTags(): SagaType {
  yield takeLatest(fetchTagsRequest.type, fetchTagsSaga);
  yield takeLatest(addTagRequest.type, addTagSaga);
  yield takeLatest(editTagRequest.type, editTagSaga);
  yield takeLatest(deleteTagRequest.type, deleteTagSaga);
}
