import request from 'supertest';
import express from 'express';
import userRoutes from '../routes/user.routes';
import { prisma } from '../index';

jest.mock('../index', () => ({
  prisma: {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      upsert: jest.fn(),
    },
  },
}));

jest.mock('../middlewares/auth.middleware', () => ({
  authenticate: (req: any, res: any, next: any) => next(), // Mock to bypass auth
}));

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/users', () => {
    it('should create a user successfully', async () => {
      const userData = { email: 'test@example.com', password: 'password', name: 'Test User' };
      const createdUser = { id: 1, ...userData };
      (prisma.user.create as jest.Mock).mockResolvedValue(createdUser);

      const res = await request(app).post('/api/users').send(userData);
      expect(res.status).toBe(201);
      expect(res.body).toEqual(createdUser);
    });

    it('should return 400 for missing email or password', async () => {
      const res = await request(app).post('/api/users').send({ name: 'Test' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Email and password are required');
    });
  });

  describe('GET /api/users', () => {
    it('should return list of users', async () => {
      const users = [{ id: 1, email: 'user1@example.com' }];
      (prisma.user.findMany as jest.Mock).mockResolvedValue(users);

      const res = await request(app).get('/api/users');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(users);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user by id', async () => {
      const user = { id: 1, email: 'test@example.com' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);

      const res = await request(app).get('/api/users/1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(user);
    });

    it('should return 404 if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const res = await request(app).get('/api/users/999');
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user', async () => {
      const updateData = { name: 'Updated Name' };
      const updatedUser = { id: 1, email: 'test@example.com', name: 'Updated Name' };
      (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const res = await request(app).put('/api/users/1').send(updateData);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(updatedUser);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user', async () => {
      (prisma.user.delete as jest.Mock).mockResolvedValue({ id: 1 });

      const res = await request(app).delete('/api/users/1');
      expect(res.status).toBe(204);
    });
  });
});
