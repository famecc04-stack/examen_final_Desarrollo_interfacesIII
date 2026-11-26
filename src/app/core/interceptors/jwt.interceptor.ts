import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { Router } from '@angular/router';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toastService = inject(ToastService);
  const router = inject(Router);

  const token = authService.token;

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        toastService.error('Sesión Expirada', 'Tu sesión ha caducado o el token es inválido.');
        authService.logout();
      } else if (error.status === 403) {
        toastService.warning('Acceso Denegado', 'No posees permisos suficientes para realizar esta acción.');
        router.navigate(['/unauthorized']);
      }
      return throwError(() => error);
    })
  );
};
