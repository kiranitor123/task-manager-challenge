import { Injectable } from '@angular/core';
import { Observable, switchMap, throwError } from 'rxjs';
import { AuthRepository } from '../../repositories/auth.repository';
import { User } from '../../entities/user.entity';
import { Email } from '../../value-objects/email.vo';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception';

@Injectable({
  providedIn: 'root'
})
export class LoginUserUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(emailString: string): Observable<User> {
    try {
      const email = new Email(emailString);
      
      return this.authRepository.findUserByEmail(email).pipe(
        switchMap(user => {
          if (!user) {
            return throwError(() => new UserNotFoundException(email.value));
          }
          
          return this.authRepository.saveCurrentUser(user).pipe(
            switchMap(() => [user])
          );
        })
      );
    } catch (error) {
      return throwError(() => error);
    }
  }
}
