import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Author } from '../../api/types';

interface AuthorsState {
  list: Author[];
  loading: boolean;
  error: string | null;
}

const initialState: AuthorsState = {
  list: [],
  loading: false,
  error: null,
};

const authorsSlice = createSlice({
  name: 'authors',
  initialState,
  reducers: {
    fetchAuthorsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAuthorsSuccess: (state, action: PayloadAction<Author[]>) => {
      state.loading = false;
      state.list = action.payload;
    },
    fetchAuthorsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addAuthorRequest: (
      state,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _action: PayloadAction<{ name: string; lastName: string; secondName?: string }>,
    ) => {
      state.loading = true;
      state.error = null;
    },
    addAuthorSuccess: (state) => {
      state.loading = false;
    },
    addAuthorFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    editAuthorRequest: (
      state,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _action: PayloadAction<{
        id: number;
        data: { name: string; lastName: string; secondName?: string };
      }>,
    ) => {
      state.loading = true;
      state.error = null;
    },
    editAuthorSuccess: (state) => {
      state.loading = false;
    },
    editAuthorFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    deleteAuthorRequest: (state, _action: PayloadAction<number>) => {
      state.loading = true;
      state.error = null;
    },
    deleteAuthorSuccess: (state) => {
      state.loading = false;
    },
    deleteAuthorFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
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
} = authorsSlice.actions;

export default authorsSlice.reducer;
