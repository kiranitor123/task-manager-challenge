import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthPresenter } from './auth.presenter';
import { LoginUserUseCase } from '../../domain/use-cases/auth/login-user.use-case';
import { CreateUserUseCase } from '../../domain/use-cases/auth/create-user.use-case';
import { LogoutUserUseCase } from '../../domain/use-cases/auth/logout-user.use-case';
import { GetCurrentUserUseCase } from '../../domain/use-cases/auth/get-current-user.use-case';
import { User } from '../../domain/entities/user.entity';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';

describe('AuthPresenter', () => {
    let presenter: AuthPresenter;
    let mockRouter: jasmine.SpyObj<Router>;
    let mockLoginUserUseCase: jasmine.SpyObj<LoginUserUseCase>;
    let mockCreateUserUseCase: jasmine.SpyObj<CreateUserUseCase>;
    let mockLogoutUserUseCase: jasmine.SpyObj<LogoutUserUseCase>;
    let mockGetCurrentUserUseCase: jasmine.SpyObj<GetCurrentUserUseCase>;

    beforeEach(() => {
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        const loginSpy = jasmine.createSpyObj('LoginUserUseCase', ['execute']);
        const createSpy = jasmine.createSpyObj('CreateUserUseCase', ['execute']);
        const logoutSpy = jasmine.createSpyObj('LogoutUserUseCase', ['execute']);
        const getCurrentSpy = jasmine.createSpyObj('GetCurrentUserUseCase', ['execute']);

        getCurrentSpy.execute.and.returnValue(of(null));

        TestBed.configureTestingModule({
            providers: [
                AuthPresenter,
                { provide: Router, useValue: routerSpy },
                { provide: LoginUserUseCase, useValue: loginSpy },
                { provide: CreateUserUseCase, useValue: createSpy },
                { provide: LogoutUserUseCase, useValue: logoutSpy },
                { provide: GetCurrentUserUseCase, useValue: getCurrentSpy }
            ]
        });

        presenter = TestBed.inject(AuthPresenter);
        mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        mockLoginUserUseCase = TestBed.inject(LoginUserUseCase) as jasmine.SpyObj<LoginUserUseCase>;
        mockCreateUserUseCase = TestBed.inject(CreateUserUseCase) as jasmine.SpyObj<CreateUserUseCase>;
        mockLogoutUserUseCase = TestBed.inject(LogoutUserUseCase) as jasmine.SpyObj<LogoutUserUseCase>;
        mockGetCurrentUserUseCase = TestBed.inject(GetCurrentUserUseCase) as jasmine.SpyObj<GetCurrentUserUseCase>;
    });

    describe('login', () => {
        it('should login successfully and set user', () => {
            // Arrange
            const email = 'test@example.com';
            const mockUser = User.create(email);
            mockLoginUserUseCase.execute.and.returnValue(of(mockUser));

            // Act
            presenter.login(email).subscribe();

            // Assert
            expect(presenter.isLoading()).toBe(false);
            expect(presenter.error()).toBeNull();
            expect(mockLoginUserUseCase.execute).toHaveBeenCalledWith(email);
            expect(presenter.isAuthenticated()).toBe(true);
        });

        it('should handle UserNotFoundException', () => {
            // Arrange
            const email = 'nonexistent@example.com';
            const error = new UserNotFoundException(email);
            mockLoginUserUseCase.execute.and.returnValue(throwError(() => error));

            // Act
            presenter.login(email).subscribe();

            // Assert
            expect(presenter.isLoading()).toBe(false);
            expect(presenter.error()).toBe('User not found');
        });

        it('should handle generic errors', () => {
            // Arrange
            const email = 'test@example.com';
            const error = new Error('Network error');
            mockLoginUserUseCase.execute.and.returnValue(throwError(() => error));

            // Act
            presenter.login(email).subscribe();

            // Assert
            expect(presenter.isLoading()).toBe(false);
            expect(presenter.error()).toBe('Network error');
        });
    });

    describe('loginSuccess', () => {
        it('should set user and navigate to tasks', () => {
            // Arrange
            const mockUser = User.create('test@example.com');

            // Act
            presenter.loginSuccess(mockUser);
            mockRouter.navigate.and.returnValue(Promise.resolve(true));
            // Assert
            expect(presenter.currentUser()).toBe(mockUser);
            expect(presenter.isAuthenticated()).toBe(true);
            expect(presenter.isLoading()).toBe(false);
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/tasks']);
        });
    });

    describe('logout', () => {
        it('should logout successfully and navigate to login', () => {
            // Arrange
            const mockUser = User.create('test@example.com');
            presenter.loginSuccess(mockUser);
            mockLogoutUserUseCase.execute.and.returnValue(of(void 0));

            // Act
            presenter.logout();

            // Assert
            expect(mockLogoutUserUseCase.execute).toHaveBeenCalled();
            expect(presenter.currentUser()).toBeNull();
            expect(presenter.isAuthenticated()).toBe(false);
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
        });
    });

    describe('computed properties', () => {
        it('should compute isAuthenticated correctly', () => {
            // Arrange
            const mockUser = User.create('test@example.com');

            // Act & Assert
            expect(presenter.isAuthenticated()).toBe(false);

            presenter.loginSuccess(mockUser);
            expect(presenter.isAuthenticated()).toBe(true);
        });

        it('should compute currentUser correctly', () => {
            // Arrange
            const mockUser = User.create('test@example.com');

            // Act & Assert
            expect(presenter.currentUser()).toBeNull();

            presenter.loginSuccess(mockUser);
            expect(presenter.currentUser()).toBe(mockUser);
        });
    });

    describe('clearError', () => {
        it('should clear error message', () => {
            // Arrange
            const email = 'test@example.com';
            const error = new Error('Test error');
            mockLoginUserUseCase.execute.and.returnValue(throwError(() => error));
            presenter.login(email);

            // Act
            presenter.clearError();

            // Assert
            expect(presenter.error()).toBeNull();
        });
    });
});