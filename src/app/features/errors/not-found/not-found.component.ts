import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white text-center">
      <div class="max-w-md w-full p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl"></div>
        <div class="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 mb-2">
          404
        </div>
        <h2 class="text-xl font-bold tracking-tight mb-2">Página No Encontrada</h2>
        <p class="text-xs text-slate-400 leading-relaxed mb-6">
          La ruta que intentas consultar no existe o ha sido reubicada dentro del sistema académico EduCore.
        </p>

        <a
          routerLink="/dashboard"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Regresar al Dashboard
        </a>
      </div>
    </div>
  `
})
export class NotFoundComponent {}
