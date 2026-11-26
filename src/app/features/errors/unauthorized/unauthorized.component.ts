import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white text-center">
      <div class="max-w-md w-full p-8 rounded-3xl bg-slate-900/60 border border-rose-900/40 shadow-2xl relative overflow-hidden">
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/10 rounded-full blur-2xl"></div>
        <div class="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500 mb-2">
          403
        </div>
        <h2 class="text-xl font-bold tracking-tight mb-2">Acceso No Autorizado</h2>
        <p class="text-xs text-slate-400 leading-relaxed mb-6">
          Tu rol de usuario actual no cuenta con los privilegios de seguridad necesarios para acceder a esta vista o recurso institucional.
        </p>

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            routerLink="/dashboard"
            class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
          >
            Ir a mi Dashboard
          </a>
          <a
            routerLink="/auth/login"
            class="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all"
          >
            Cambiar de Usuario
          </a>
        </div>
      </div>
    </div>
  `
})
export class UnauthorizedComponent {}
