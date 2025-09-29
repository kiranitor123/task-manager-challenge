import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRepository } from '../../repositories/auth.repository';
import { User } from '../../entities/user.entity';

@Injectable({
  providedIn: 'root'
})
export class GetCurrentUserUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(): Observable<User | null> {
    return this.authRepository.getCurrentUser();
  }
}