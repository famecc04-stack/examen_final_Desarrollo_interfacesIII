import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = route.data?.['roles'] as Role[] | undefined;
  if (!allowedRoles || allowedRoles.length === 0) {
    return true; // No restriction on roles
  }

  if (authService.hasRole(allowedRoles)) {
    return true;
  }

  // Si no cuenta con el rol requerido, redirige a vista 403 (No autorizado)
  router.navigate(['/unauthorized']);
  return false;
};
