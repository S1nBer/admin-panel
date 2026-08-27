import { axiosInstance } from './axiosInstance';
import type { Author, AuthorFormData } from './types';

export const authorsApi = {
  getAuthors: () => axiosInstance.get<Author[]>('/manage/authors'),

  addAuthor: (data: AuthorFormData) => {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('lastName', data.lastName);

    if (data.secondName) {
      formData.append('secondName', data.secondName);
    }

    return axiosInstance.post('/manage/authors/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  editAuthor: (id: number, data: AuthorFormData) => {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('lastName', data.lastName);

    if (data.secondName) {
      formData.append('secondName', data.secondName);
    }

    return axiosInstance.post(`/manage/authors/edit?id=${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteAuthor: (id: number) => axiosInstance.delete(`/manage/authors/remove?id=${id}`),
};
