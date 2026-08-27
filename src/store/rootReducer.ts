import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import type { History } from 'history';
import authReducer from './slices/authSlice';
import postsReducer from './slices/postsSlice';
import authorsReducer from './slices/authorsSlice';
import tagsReducer from './slices/tagsSlice';

export const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    auth: authReducer,
    posts: postsReducer,
    authors: authorsReducer,
    tags: tagsReducer,
  });
