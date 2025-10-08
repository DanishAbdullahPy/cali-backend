export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  fetchLoading: boolean;
  error: string | null;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}