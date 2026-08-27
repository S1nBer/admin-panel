import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Post, PostDetail, PostsResponse } from '../../api/types';

interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  pagination: {
    current: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  selectedPost: PostDetail | null;
}

const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
  pagination: {
    current: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  selectedPost: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fetchPostsRequest: (state, _action: PayloadAction<{ page: number; limit?: number }>) => {
      state.loading = true;
      state.error = null;
    },
    fetchPostsSuccess: (state, action: PayloadAction<PostsResponse>) => {
      state.loading = false;
      state.posts = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    fetchPostsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fetchPostDetailRequest: (state, _action: PayloadAction<number>) => {
      state.loading = true;
      state.error = null;
    },
    fetchPostDetailSuccess: (state, action: PayloadAction<PostDetail>) => {
      state.loading = false;
      state.selectedPost = action.payload;
    },
    fetchPostDetailFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addPostRequest: (state, _action: PayloadAction<FormData>) => {
      state.loading = true;
      state.error = null;
    },
    addPostSuccess: (state) => {
      state.loading = false;
    },
    addPostFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    editPostRequest: (state, _action: PayloadAction<{ id: number; data: FormData }>) => {
      state.loading = true;
      state.error = null;
    },
    editPostSuccess: (state) => {
      state.loading = false;
    },
    editPostFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    deletePostRequest: (state, _action: PayloadAction<number>) => {
      state.loading = true;
      state.error = null;
    },
    deletePostSuccess: (state) => {
      state.loading = false;
    },
    deletePostFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearSelectedPost: (state) => {
      state.selectedPost = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchPostsRequest,
  fetchPostsSuccess,
  fetchPostsFailure,
  fetchPostDetailRequest,
  fetchPostDetailSuccess,
  fetchPostDetailFailure,
  addPostRequest,
  addPostSuccess,
  addPostFailure,
  editPostRequest,
  editPostSuccess,
  editPostFailure,
  deletePostRequest,
  deletePostSuccess,
  deletePostFailure,
  clearSelectedPost,
  clearError,
} = postsSlice.actions;

export default postsSlice.reducer;
