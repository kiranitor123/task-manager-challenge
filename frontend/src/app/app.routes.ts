import { Routes, RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthPresenter } from './presentation/presenters/auth.presenter';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./presentation/pages/auth/login/login.component').then(m => m.LoginComponent),
    // Si ya hay un usuario autenticado, redirige a tasks
    canActivate: [() => {
      const auth = inject(AuthPresenter);
      const router = inject(Router);
      if (auth.isAuthenticated()) {
        router.navigate(['tasks']);
        return false;
      }
      return true;
    }]
  },
  {
    path: 'tasks',
    loadComponent: () => import('./presentation/pages/tasks/task-list/task-list.component').then(m => m.TaskListComponent),
    // Protege la ruta para solo usuarios autenticados
    canActivate: [() => {
      const auth = inject(AuthPresenter);
      const router = inject(Router);
      if (!auth.isAuthenticated()) {
        router.navigate(['login']);
        return false;
      }
      return true;
    }]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
