export interface ValidationError {
  field: string;
  message: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  access_expired_at: number;
  refresh_expired_at: number;
}

export interface PaginationParams {
  page: number;
  limit?: number;
}

export interface PaginationMeta {
  current: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Author {
  id: number;
  name: string;
  lastName: string;
  secondName?: string;
}

export interface AuthorFormData {
  name: string;
  lastName: string;
  secondName?: string;
}

export interface Post {
  id: number;
  title: string;
  code: string;
  authorName: string;
  previewPicture: {
    id: number;
    name: string;
    url: string;
  } | null;
  tagNames: string[];
  updatedAt: string;
  createdAt: string;
}

export interface PostDetail extends Post {
  authorId: number;
  tagIds: number[];
  text: string;
}

export interface PostsResponse {
  data: Post[];
  pagination: PaginationMeta;
}

export interface Tag {
  id: number;
  name: string;
}
