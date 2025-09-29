import { Component, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

import { AuthPresenter } from '../../../presenters/auth.presenter';
import { UserNotFoundException } from '../../../../domain/exceptions/user-not-found.exception';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    protected authPresenter: AuthPresenter,
    private dialog: MatDialog
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    // Redirect if already authenticated
    if (this.authPresenter.isAuthenticated()) {
      // Router navigation is handled by AuthPresenter
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      
      this.authPresenter.login(email).subscribe({
        next: (user:any) => {
          if (user) {
            this.authPresenter.loginSuccess(user);
          }
        },
        error: (error:any) => {
          if (error instanceof UserNotFoundException) {
            this.showCreateUserDialog(email);
          }
        }
      });
    }
  }

  private showCreateUserDialog(email: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Usuario no encontrado',
        message: `El usuario con email "${email}" no existe. ¿Deseas crear una nueva cuenta?`,
        confirmText: 'Crear Cuenta',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if (result) {
        this.authPresenter.createUser(email).subscribe();
      }
    });
  }
}