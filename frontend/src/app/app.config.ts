import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { AuthRepository } from './domain/repositories/auth.repository';
import { AuthRepositoryImpl } from './infrastructure/repositories/auth.repository.impl';
import { TaskRepository } from './domain/repositories/task.repository';
import { TaskRepositoryImpl } from './infrastructure/repositories/task.repository.impl';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    { provide: AuthRepository, useClass: AuthRepositoryImpl },
    { provide: TaskRepository, useClass: TaskRepositoryImpl },
  ]
};
