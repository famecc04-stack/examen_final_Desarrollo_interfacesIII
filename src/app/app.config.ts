import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { mockBackendInterceptor } from './core/interceptors/mock-backend.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    // jwtInterceptor inyecta el Bearer Token y captura 401/403.
    // mockBackendInterceptor atiende las rutas /api/ emulando el backend y validando el Bearer Token.
    provideHttpClient(
      withInterceptors([jwtInterceptor, mockBackendInterceptor])
    )
  ]
};
