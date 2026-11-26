import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loginGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // Si ya tiene sesión activa, redirige al dashboard directamente
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
