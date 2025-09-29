import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRepository } from '../../repositories/auth.repository';

@Injectable({
  providedIn: 'root'
})
export class LogoutUserUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(): Observable<void> {
    return this.authRepository.clearCurrentUser();
  }
}