import { Injectable } from '@angular/core';
import { Observable, switchMap, throwError } from 'rxjs';
import { AuthRepository } from '../../repositories/auth.repository';
import { User } from '../../entities/user.entity';
import { Email } from '../../value-objects/email.vo';

@Injectable({
  providedIn: 'root'
})
export class CreateUserUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(emailString: string): Observable<User> {
    try {
      const email = new Email(emailString);
      const user = User.create(email.value);
      
      return this.authRepository.createUser(user).pipe(
        switchMap(createdUser => 
          this.authRepository.saveCurrentUser(createdUser).pipe(
            switchMap(() => [createdUser])
          )
        )
      );
    } catch (error) {
      return throwError(() => error);
    }
  }
}
