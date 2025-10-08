import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/auth.routes';
import { prisma } from '../index';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt';

jest.mock('../index', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    it('should return 400 if email or password is missing', async () => {
      const res = await request(app).post('/api/auth/login').send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Email and password are required');
    });

    it('should return 400 for invalid credentials', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const res = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid email or password');
    });

    it('should return 400 for wrong password', async () => {
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: hashedPassword,
      });

      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid email or password');
    });

    it('should return user and token for valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('password', 10);
      const user = {
        id: 1,
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);

      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password',
      });
      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
      expect(res.body.token).toBeDefined();
    });
  });
});
