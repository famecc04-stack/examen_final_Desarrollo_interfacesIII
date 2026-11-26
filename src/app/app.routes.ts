import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { loginGuard } from './core/guards/login.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  // Redirección por defecto
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },

  // Ruta Pública: Login con Lazy Loading y LoginGuard (si ya tiene sesión, va a dashboard)
  {
    path: 'auth/login',
    canActivate: [loginGuard],
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },

  // Rutas Privadas: Anidadas bajo el MainLayoutComponent con AuthGuard
  {
    path: 'dashboard',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'cursos',
        loadComponent: () => import('./features/courses/course-list/course-list.component').then(m => m.CourseListComponent)
      },
      {
        path: 'cursos/:id',
        loadComponent: () => import('./features/courses/course-detail/course-detail.component').then(m => m.CourseDetailComponent)
      },
      {
        path: 'usuarios',
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
        loadComponent: () => import('./features/users/user-list/user-list.component').then(m => m.UserListComponent)
      }
    ]
  },

  // Rutas de Control de Errores y Seguridad
  {
    path: 'unauthorized',
    loadComponent: () => import('./features/errors/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  {
    path: '404',
    loadComponent: () => import('./features/errors/not-found/not-found.component').then(m => m.NotFoundComponent)
  },

  // Ruta Comodín (Wildcard) hacia 404
  {
    path: '**',
    redirectTo: '404'
  }
];
