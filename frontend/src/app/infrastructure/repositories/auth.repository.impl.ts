import { Injectable } from '@angular/core';
import { Observable, map, switchMap, of, throwError } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { ApiAdapter } from '../adapters/api.adapter';
import { StorageService } from '../services/storage.service';

interface UserDTO {
  id: string;
  email: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthRepositoryImpl extends AuthRepository {
  private readonly CURRENT_USER_KEY = 'currentUser';

  constructor(
    private apiAdapter: ApiAdapter,
    private storageService: StorageService
  ) {
    super();
  }

  findUserByEmail(email: Email): Observable<User | null> {
    return this.apiAdapter.get<UserDTO>(`/users/${email.value}`).pipe(
      map(response => {
        if (!response.success || !response.data) {
          return null;
        }
        return this.mapDTOToEntity(response.data);
      })
    );
  }

  createUser(user: User): Observable<User> {
    const dto = {
      email: user.email
    };

    return this.apiAdapter.post<UserDTO>('/users', dto).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.error || 'Failed to create user');
        }
        return this.mapDTOToEntity(response.data);
      })
    );
  }

  getCurrentUser(): Observable<User | null> {
    return this.storageService.get<UserDTO>(this.CURRENT_USER_KEY).pipe(
      map(userData => {
        if (!userData) return null;
        return this.mapDTOToEntity(userData);
      })
    );
  }

  saveCurrentUser(user: User): Observable<void> {
    const dto: UserDTO = {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt.toISOString()
    };
    return this.storageService.save(this.CURRENT_USER_KEY, dto);
  }

  clearCurrentUser(): Observable<void> {
    return this.storageService.remove(this.CURRENT_USER_KEY);
  }

  private mapDTOToEntity(dto: UserDTO): User {
    return new User(
      dto.id,
      new Email(dto.email),
      new Date(dto.createdAt)
    );
  }
}
