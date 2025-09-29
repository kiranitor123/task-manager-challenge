import { User } from './user.entity';

describe('User Entity', () => {
  describe('create', () => {
    it('should create a user with valid email', () => {
      // Arrange
      const email = 'test@example.com';

      // Act
      const user = User.create(email);

      // Assert
      expect(user).toBeInstanceOf(User);
      expect(user.email).toBe(email);
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('should throw error for invalid email', () => {
      // Arrange
      const invalidEmail = 'invalid-email';

      // Act & Assert
      expect(() => User.create(invalidEmail)).toThrow();
    });
  });

  describe('toJSON', () => {
    it('should serialize user correctly', () => {
      // Arrange
      const email = 'test@example.com';
      const user = User.create(email);

      // Act
      const json = user.toJSON();

      // Assert
      expect(json).toEqual({
        id: user.id,
        email: email,
        createdAt: user.createdAt
      });
    });
  });
});