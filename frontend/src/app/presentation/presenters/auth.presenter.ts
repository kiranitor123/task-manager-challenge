import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, catchError, of, switchMap } from 'rxjs';
import { LoginUserUseCase } from '../../domain/use-cases/auth/login-user.use-case';
import { CreateUserUseCase } from '../../domain/use-cases/auth/create-user.use-case';
import { LogoutUserUseCase } from '../../domain/use-cases/auth/logout-user.use-case';
import { GetCurrentUserUseCase } from '../../domain/use-cases/auth/get-current-user.use-case';
import { User } from '../../domain/entities/user.entity';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { NotificationService } from '../../infrastructure/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthPresenter {
  private readonly userSignal = signal<User | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  // Computed properties
  readonly currentUser = computed(() => this.userSignal());
  readonly isAuthenticated = computed(() => !!this.userSignal());
  readonly isLoading = computed(() => this.loadingSignal());
  readonly error = computed(() => this.errorSignal());

  constructor(
    private loginUserUseCase: LoginUserUseCase,
    private createUserUseCase: CreateUserUseCase,
    private logoutUserUseCase: LogoutUserUseCase,
    private getCurrentUserUseCase: GetCurrentUserUseCase,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.initializeCurrentUser();
  }

  login(email: string): Observable<User | null> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.loginUserUseCase.execute(email).pipe(
      switchMap((user) => {
        this.loginSuccess(user);
        return of(user);
      }),
      catchError(error => {
        this.loadingSignal.set(false);

        if (error instanceof UserNotFoundException) {
          this.errorSignal.set('User not found');
          return of(null);
        }

        this.errorSignal.set(error.message || 'Error logging in');
        this.notificationService.error('Error logging in');
        return of(null);
      })
    );
  }

  createUser(email: string): Observable<boolean> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return new Observable(observer => {
      this.createUserUseCase.execute(email).subscribe({
        next: (user) => {
          this.userSignal.set(user);
          this.loadingSignal.set(false);
          this.notificationService.success('Account created successfully!');
          this.router.navigate(['/tasks']);
          observer.next(true);
          observer.complete();
        },
        error: (error) => {
          this.loadingSignal.set(false);
          this.errorSignal.set(error.message || 'Error creating user');
          this.notificationService.error('Error creating account');
          observer.next(false);
          observer.complete();
        }
      });
    });
  }

  loginSuccess(user: User): void {
    this.userSignal.set(user);
    this.loadingSignal.set(false);
    this.notificationService.success('Welcome back!');
    this.router.navigate(['/tasks']);
  }

  logout(): void {
    this.logoutUserUseCase.execute().subscribe({
      next: () => {
        this.userSignal.set(null);
        this.errorSignal.set(null);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error during logout:', error);
        // Force logout even if there's an error
        this.userSignal.set(null);
        this.router.navigate(['/login']);
      }
    });
  }

  clearError(): void {
    this.errorSignal.set(null);
  }

  private initializeCurrentUser(): void {
    this.getCurrentUserUseCase.execute().subscribe({
      next: (user) => {
        this.userSignal.set(user);
      },
      error: (error) => {
        console.error('Error loading current user:', error);
        this.userSignal.set(null);
      }
    });
  }
}