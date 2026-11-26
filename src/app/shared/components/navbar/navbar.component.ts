import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { RoleBadgePipe } from '../../pipes/role-badge.pipe';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RoleBadgePipe],
  template: `
    <header class="h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20">
      <!-- Search / Context -->
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Plataforma Cloud EduCore Activa</span>
          <span class="text-slate-300 dark:text-slate-700">|</span>
          <span class="hidden md:inline text-slate-600 dark:text-slate-400">Zegel IPAE · 4to Ciclo</span>
        </div>
      </div>

      <!-- User actions and indicator -->
      <div *ngIf="authService.currentUser$ | async as user" class="flex items-center gap-4">
        <!-- Quick Role Tag -->
        <div class="hidden sm:flex items-center gap-2">
          <span class="text-xs text-slate-500">Conectado como:</span>
          <span
            [ngClass]="(user.role | roleBadge).bgClass + ' ' + (user.role | roleBadge).textClass"
            class="px-2.5 py-0.5 rounded-full text-xs font-semibold"
          >
            {{ (user.role | roleBadge).label }}
          </span>
        </div>

        <div class="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>

        <!-- User identity pill -->
        <div class="flex items-center gap-3">
          <img [src]="user.avatar" [alt]="user.name" class="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20" />
          <div class="hidden md:block text-left">
            <p class="text-xs font-bold text-slate-800 dark:text-slate-200">{{ user.name }}</p>
            <p class="text-[10px] text-slate-500 truncate max-w-[150px]">{{ user.email }}</p>
          </div>
        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {
  authService = inject(AuthService);
}
