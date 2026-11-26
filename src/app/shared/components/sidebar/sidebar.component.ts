import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RoleBadgePipe } from '../../pipes/role-badge.pipe';
import { HasRoleDirective } from '../../directives/has-role.directive';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RoleBadgePipe, HasRoleDirective],
  template: `
    <aside class="w-64 bg-slate-950 text-slate-200 flex flex-col h-screen border-r border-slate-800 shadow-xl select-none">
      <!-- Brand Logo -->
      <div class="h-20 flex items-center gap-3 px-6 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-xl">
          Z
        </div>
        <div>
          <h1 class="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
            EduCore <span class="text-blue-400">Zegel</span>
          </h1>
          <span class="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Gestión Académica</span>
        </div>
      </div>

      <!-- User Mini Profile -->
      <div *ngIf="authService.currentUser$ | async as user" class="p-4 mx-3 my-4 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center gap-3">
        <img [src]="user.avatar" [alt]="user.name" class="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/30" />
        <div class="overflow-hidden flex-1">
          <p class="text-xs font-bold text-white truncate">{{ user.name }}</p>
          <div class="mt-1">
            <span
              [ngClass]="(user.role | roleBadge).bgClass + ' ' + (user.role | roleBadge).textClass"
              class="inline-block px-2 py-0.5 rounded text-[10px] font-semibold"
            >
              {{ (user.role | roleBadge).label }}
            </span>
          </div>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 px-3 space-y-1.5 overflow-y-auto pt-2">
        <div class="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Menú Principal</div>

        <!-- Dashboard: Visible a todos -->
        <a
          routerLink="/dashboard"
          routerLinkActive="bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold"
          [routerLinkActiveOptions]="{ exact: true }"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all duration-150 group"
        >
          <svg class="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Panel General
        </a>

        <!-- Cursos: Visible a todos los roles -->
        <a
          routerLink="/dashboard/cursos"
          routerLinkActive="bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all duration-150 group"
        >
          <svg class="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span>Gestión de Cursos</span>
        </a>

        <!-- Usuarios: Solo para rol 'admin' (Directiva appHasRole) -->
        <a
          *appHasRole="['admin']"
          routerLink="/dashboard/usuarios"
          routerLinkActive="bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all duration-150 group"
        >
          <svg class="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <div class="flex items-center justify-between w-full">
            <span>Directorio Usuarios</span>
            <span class="text-[9px] bg-purple-900/60 text-purple-300 px-1.5 py-0.5 rounded font-mono font-bold">ADMIN</span>
          </div>
        </a>

        <!-- Sección de Accesos de Rol Informativos -->
        <div class="pt-4 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Módulos Institucionales</div>
        
        <div class="px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-800/40 text-[11px] text-slate-400">
          <p class="font-medium text-slate-300">Semestre 2026-I · 4to Ciclo</p>
          <p class="text-[10px] text-slate-500 mt-0.5">Sede Central Lima / Zegel Virtual</p>
        </div>
      </nav>

      <!-- Logout Footer -->
      <div class="p-4 border-t border-slate-800 bg-slate-950/80">
        <button
          (click)="onLogout()"
          class="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-transparent hover:border-rose-900/50 transition-all duration-150"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar Sesión
        </button>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  onLogout(): void {
    this.authService.logout();
  }
}
