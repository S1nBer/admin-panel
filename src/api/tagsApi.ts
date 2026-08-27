import { axiosInstance } from './axiosInstance';
import type { Tag } from './types';

export const tagsApi = {
  getTags: () => axiosInstance.get<Tag[]>('/manage/tags'),

  addTag: (data: { name: string }) => {
    const formData = new FormData();
    formData.append('name', data.name);

    return axiosInstance.post('/manage/tags/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  editTag: (id: number, data: { name: string }) => {
    const formData = new FormData();
    formData.append('name', data.name);

    return axiosInstance.post(`/manage/tags/edit?id=${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteTag: (id: number) => axiosInstance.delete(`/manage/tags/remove?id=${id}`),
};
