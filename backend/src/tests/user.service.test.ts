import * as userService from '../services/user.service';
import { prisma } from '../index';
import bcrypt from 'bcrypt';

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

jest.mock('axios', () => ({
  get: jest.fn(),
}));

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user with hashed password', async () => {
      const userData = { email: 'test@example.com', password: 'password', name: 'Test User' };
      const createdUser = { id: 1, ...userData, password: 'hashed' };
      (prisma.user.create as jest.Mock).mockResolvedValue(createdUser);

      const result = await userService.createUser(userData);
      expect(result).toEqual(createdUser);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { ...userData, password: expect.any(String) },
      });
    });
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const users = [{ id: 1, email: 'user1@example.com' }];
      (prisma.user.findMany as jest.Mock).mockResolvedValue(users);

      const result = await userService.getUsers();
      expect(result).toEqual(users);
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const user = { id: 1, email: 'test@example.com' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);

      const result = await userService.getUserById(1);
      expect(result).toEqual(user);
    });
  });

  describe('updateUser', () => {
    it('should update user without password change', async () => {
      const updateData = { name: 'Updated Name' };
      const updatedUser = { id: 1, email: 'test@example.com', name: 'Updated Name' };
      (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await userService.updateUser(1, updateData);
      expect(result).toEqual(updatedUser);
    });

    it('should hash password if provided', async () => {
      const updateData = { password: 'newpassword' };
      const updatedUser = { id: 1, email: 'test@example.com', password: 'hashed' };
      (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await userService.updateUser(1, updateData);
      expect(result).toEqual(updatedUser);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { password: expect.any(String) },
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      const deletedUser = { id: 1 };
      (prisma.user.delete as jest.Mock).mockResolvedValue(deletedUser);

      const result = await userService.deleteUser(1);
      expect(result).toEqual(deletedUser);
    });
  });

  describe('fetchAndStoreUsers', () => {
    it('should fetch and store users', async () => {
      const mockUsers = [
        { id: 1, email: 'user1@example.com', first_name: 'John', last_name: 'Doe', avatar: 'avatar1.jpg' },
      ];
      const axios = require('axios');
      (axios.get as jest.Mock).mockResolvedValue({ data: { data: mockUsers } });

      (prisma.user.upsert as jest.Mock).mockResolvedValue({});

      await userService.fetchAndStoreUsers();

      expect(axios.get).toHaveBeenCalledWith('https://reqres.in/api/users');
      expect(prisma.user.upsert).toHaveBeenCalledTimes(1);
      expect(prisma.user.upsert).toHaveBeenCalledWith({
        where: { email: 'user1@example.com' },
        update: {},
        create: {
          email: 'user1@example.com',
          name: 'John Doe',
          avatar: 'avatar1.jpg',
          password: expect.any(String),
        },
      });
    });
  });
});
