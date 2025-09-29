import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { LoginUserUseCase } from './login-user.use-case';
import { AuthRepository } from '../../repositories/auth.repository';
import { User } from '../../entities/user.entity';
import { Email } from '../../value-objects/email.vo';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception';

describe('LoginUserUseCase', () => {
  let useCase: LoginUserUseCase;
  let mockAuthRepository: jasmine.SpyObj<AuthRepository>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthRepository', ['findUserByEmail', 'saveCurrentUser']);

    TestBed.configureTestingModule({
      providers: [
        LoginUserUseCase,
        { provide: AuthRepository, useValue: spy }
      ]
    });

    useCase = TestBed.inject(LoginUserUseCase);
    mockAuthRepository = TestBed.inject(AuthRepository) as jasmine.SpyObj<AuthRepository>;
  });

  describe('execute', () => {
    it('should login user successfully when user exists', () => {
      // Arrange
      const email = 'test@example.com';
      const mockUser = User.create(email);
      mockAuthRepository.findUserByEmail.and.returnValue(of(mockUser));
      mockAuthRepository.saveCurrentUser.and.returnValue(of(void 0));

      // Act
      useCase.execute(email).subscribe({
        next: (result) => {
          // Assert
          expect(result).toBe(mockUser);
          expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledWith(jasmine.any(Email));
          expect(mockAuthRepository.saveCurrentUser).toHaveBeenCalledWith(mockUser);
        }
      });
    });

    it('should throw UserNotFoundException when user does not exist', () => {
      // Arrange
      const email = 'nonexistent@example.com';
      mockAuthRepository.findUserByEmail.and.returnValue(of(null));

      // Act
      useCase.execute(email).subscribe({
        error: (error) => {
          // Assert
          expect(error).toBeInstanceOf(UserNotFoundException);
          expect(error.message).toContain(email);
        }
      });
    });

    it('should throw error for invalid email format', () => {
      // Arrange
      const invalidEmail = 'invalid-email';

      // Act
      useCase.execute(invalidEmail).subscribe({
        error: (error) => {
          // Assert
          expect(error.message).toContain('Invalid email format');
        }
      });
    });

    it('should handle repository errors', () => {
      // Arrange
      const email = 'test@example.com';
      const repositoryError = new Error('Repository connection failed');
      mockAuthRepository.findUserByEmail.and.returnValue(throwError(() => repositoryError));

      // Act
      useCase.execute(email).subscribe({
        error: (error) => {
          // Assert
          expect(error).toBe(repositoryError);
        }
      });
    });
  });
});