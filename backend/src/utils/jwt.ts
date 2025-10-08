
import * as jwt from 'jsonwebtoken';
import { AuthPayload } from '../types';

const JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '1h';

export const generateToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
};

export const verifyToken = (token: string): AuthPayload => {
  return jwt.verify(token, JWT_SECRET) as AuthPayload;
};
