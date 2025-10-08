import { Request } from 'express';

export interface User {
  id: number;
  email: string;
  password: string;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthPayload {
  id: number;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}
