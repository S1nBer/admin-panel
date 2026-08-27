import { all, fork } from 'redux-saga/effects';
import { watchAuth } from './sagas/authSaga';
import { watchPosts } from './sagas/postsSaga';
import { watchAuthors } from './sagas/authorsSaga';
import { watchTags } from './sagas/tagsSaga';

export default function* rootSaga() {
  yield all([fork(watchAuth), fork(watchPosts), fork(watchAuthors), fork(watchTags)]);
}
