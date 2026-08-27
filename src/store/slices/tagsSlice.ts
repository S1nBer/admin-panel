import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Tag } from '../../api/types';

interface TagsState {
  list: Tag[];
  loading: boolean;
  error: string | null;
}

const initialState: TagsState = {
  list: [],
  loading: false,
  error: null,
};

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    fetchTagsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTagsSuccess: (state, action: PayloadAction<Tag[]>) => {
      state.loading = false;
      state.list = action.payload;
    },
    fetchTagsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addTagRequest: (state, _action: PayloadAction<{ name: string }>) => {
      state.loading = true;
      state.error = null;
    },
    addTagSuccess: (state) => {
      state.loading = false;
    },
    addTagFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    deleteTagRequest: (state, _action: PayloadAction<number>) => {
      state.loading = true;
      state.error = null;
    },
    deleteTagSuccess: (state) => {
      state.loading = false;
    },
    deleteTagFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    editTagRequest: (state, _action: PayloadAction<{ id: number; data: { name: string } }>) => {
      state.loading = true;
      state.error = null;
    },
    editTagSuccess: (state) => {
      state.loading = false;
    },
    editTagFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
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
} = tagsSlice.actions;

export default tagsSlice.reducer;
