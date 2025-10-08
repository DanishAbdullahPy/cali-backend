import { generateToken, verifyToken } from '../utils/jwt';

describe('JWT Utils', () => {
  describe('generateToken', () => {
    it('should generate a token', () => {
      const payload = { id: 1, email: 'test@example.com' };
      const token = generateToken(payload);
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const payload = { id: 1, email: 'test@example.com' };
      const token = generateToken(payload);
      const decoded = verifyToken(token);
      expect(decoded).toEqual(expect.objectContaining(payload));
    });

    it('should throw error for invalid token', () => {
      expect(() => verifyToken('invalid-token')).toThrow();
    });
  });
});
