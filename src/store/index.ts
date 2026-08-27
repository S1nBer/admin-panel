import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { createRootReducer } from './rootReducer';
import rootSaga from './rootSaga';

export const history = createBrowserHistory();

const rootReducer = createRootReducer(history);

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        ignoredActions: ['@@router/LOCATION_CHANGE'],
      },
    }).concat(routerMiddleware(history), sagaMiddleware),
  devTools: import.meta.env.MODE !== 'production',
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
