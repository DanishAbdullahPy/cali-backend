import * as authService from '../services/auth.service';
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

jest.mock('../utils/jwt', () => ({
  generateToken: jest.fn(),
}));

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should throw error for invalid email', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(authService.login('invalid@example.com', 'password')).rejects.toThrow('Invalid email or password');
    });

    it('should throw error for wrong password', async () => {
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: hashedPassword,
      });

      await expect(authService.login('test@example.com', 'wrongpassword')).rejects.toThrow('Invalid email or password');
    });

    it('should return user and token for valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('password', 10);
      const user = { id: 1, email: 'test@example.com', password: hashedPassword };
      const token = 'jwt-token';

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
      (generateToken as jest.Mock).mockReturnValue(token);

      const result = await authService.login('test@example.com', 'password');
      expect(result).toEqual({ user, token });
      expect(generateToken).toHaveBeenCalledWith({ id: user.id, email: user.email });
    });
  });
});
