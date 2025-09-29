import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { Email } from '../value-objects/email.vo';

export abstract class AuthRepository {
  abstract findUserByEmail(email: Email): Observable<User | null>;
  abstract createUser(user: User): Observable<User>;
  abstract getCurrentUser(): Observable<User | null>;
  abstract saveCurrentUser(user: User): Observable<void>;
  abstract clearCurrentUser(): Observable<void>;
}