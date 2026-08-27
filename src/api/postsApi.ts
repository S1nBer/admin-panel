import { axiosInstance } from './axiosInstance';
import type { PostDetail, PaginationParams, PostsResponse } from './types';

export const postsApi = {
  getPosts: (params: PaginationParams): Promise<PostsResponse> => {
    return axiosInstance.get('/manage/posts', { params }).then((response) => {
      const total = parseInt(response.headers['x-total-count'] || '0', 10);
      const totalPages = parseInt(response.headers['x-total-pages'] || '0', 10);

      return {
        data: response.data,
        pagination: {
          current: params.page,
          limit: params.limit || 10,
          total,
          totalPages,
        },
      };
    });
  },

  getPostDetail: (id: number) => axiosInstance.get<PostDetail>(`/manage/posts/detail?id=${id}`),

  addPost: (data: FormData) =>
    axiosInstance.post('/manage/posts/add', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  editPost: (id: number, data: FormData) =>
    axiosInstance.post(`/manage/posts/edit?id=${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deletePost: (id: number) => axiosInstance.delete(`/manage/posts/remove?id=${id}`),
};
