
export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  password?: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

export interface AuthPayload {
  id: number;
  email: string;
}
