import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ToastContainerComponent } from '../../../shared/components/toast/toast-container.component';
import { AuthResponse } from '../../../core/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastContainerComponent],
  template: `
    <app-toast-container />
    
    <div class="min-h-screen w-full flex flex-col lg:flex-row bg-slate-950 text-white font-sans">
      <!-- LEFT BRAND HERO PANEL (Bento Showcase) -->
      <div class="lg:w-1/2 p-8 lg:p-14 pt-12 lg:pt-16 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-950 to-blue-950 border-b lg:border-b-0 lg:border-r border-slate-800">
        <!-- Background Glows -->
        <div class="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <!-- Brand Header -->
        <div class="relative z-10 pt-2 sm:pt-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-emerald-400 flex items-center justify-center shadow-xl shadow-indigo-500/30 font-black text-2xl text-white">
              Z
            </div>
            <div>
              <h1 class="text-2xl font-black tracking-tight text-white">
                EduCore <span class="text-blue-400">Zegel</span>
              </h1>
              <p class="text-xs uppercase font-semibold text-slate-400 tracking-wider">Sistema de Gestión Académica</p>
            </div>
          </div>
        </div>

        <!-- Hero Content / Value Prop -->
        <div class="relative z-10 my-8 max-w-lg">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold mb-5">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Plataforma Académica Institucional
          </div>
          <h2 class="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Digitalización educativa con excelencia y alta seguridad.
          </h2>
          <p class="mt-4 text-slate-300 text-sm leading-relaxed">
            Entorno integral para la administración docente, seguimiento de progreso académico y gestión institucional con experiencias adaptadas a cada rol.
          </p>

          <!-- Feature Bullets Bento Style -->
          <div class="grid grid-cols-2 gap-3 mt-6">
            <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <span class="text-blue-400 text-lg font-bold">Gestión Centralizada</span>
              <p class="text-xs text-slate-400 mt-1">Control integral de asignaturas, matrículas y sílabos en tiempo real.</p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <span class="text-emerald-400 text-lg font-bold">Acceso por Perfiles</span>
              <p class="text-xs text-slate-400 mt-1">Vistas personalizadas con altos estándares de seguridad institucional.</p>
            </div>
          </div>

          <!-- INTEGRANTES DEL EQUIPO CARATULA CON FOTOS REALES Y 4TO CICLO -->
          <div class="mt-6 p-4 rounded-2xl bg-indigo-950/70 border border-indigo-500/40 backdrop-blur-md shadow-xl">
            <div class="flex items-center justify-between mb-3">
              <span class="text-[11px] font-extrabold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                👥 Integrantes del Equipo
              </span>
              <span class="text-[10px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                4to Ciclo - DINT III
              </span>
            </div>
            
            <div class="grid grid-cols-3 gap-2.5">
              <!-- 1. Estefania Orellana -->
              <div class="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center text-center">
                <img src="assets/team/estefania-orellana.jpg" alt="Estefania Orellana" class="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/60 shadow-md mb-1.5" />
                <span class="text-xs font-bold text-white leading-tight">Estefania Orellana</span>
                <span class="text-[10px] text-emerald-400 font-semibold mt-0.5">Estudiante / UI</span>
              </div>

              <!-- 2. Fabiola Cadillo (Centro) -->
              <div class="p-2 rounded-xl bg-indigo-900/50 border border-indigo-500/50 flex flex-col items-center text-center ring-1 ring-indigo-400/30">
                <img src="assets/team/fabiola-cadillo.jpg" alt="Fabiola Cadillo" class="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500 shadow-md mb-1.5" />
                <span class="text-xs font-bold text-white leading-tight">Fabiola Cadillo</span>
                <span class="text-[10px] text-blue-300 font-semibold mt-0.5">Administradora</span>
              </div>

              <!-- 3. Brayan Flores -->
              <div class="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center text-center">
                <img src="assets/team/brayan-flores.png" alt="Brayan Flores" class="w-12 h-12 rounded-full object-cover ring-2 ring-purple-500/60 shadow-md mb-1.5" />
                <span class="text-xs font-bold text-white leading-tight">Brayan Flores</span>
                <span class="text-[10px] text-purple-300 font-semibold mt-0.5">Profesor / Docente</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Note -->
        <div class="relative z-10 text-xs text-slate-500 flex items-center justify-between pt-4">
          <span>Evaluación Final Desarrollo de Interfaces III</span>
          <span>Zegel Virtual &copy; 2026</span>
        </div>
      </div>

      <!-- RIGHT LOGIN & DEMO ACCESS PANEL -->
      <div class="lg:w-1/2 p-8 lg:p-14 flex flex-col justify-center bg-slate-900/40 relative">
        <div class="max-w-md w-full mx-auto">
          <div class="text-left mb-8">
            <h3 class="text-2xl font-bold text-white">Iniciar Sesión</h3>
            <p class="text-xs text-slate-400 mt-1">Ingresa tus credenciales o selecciona un perfil de acceso rápido.</p>
          </div>

          <!-- Login Form -->
          <form (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Correo Institucional</label>
              <div class="relative">
                <input
                  type="email"
                  [(ngModel)]="email"
                  name="email"
                  required
                  placeholder="usuario@zegel.edu.pe"
                  class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Contraseña</label>
              <input
                type="password"
                [(ngModel)]="password"
                name="password"
                required
                placeholder="••••••••"
                class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <button
              type="submit"
              [disabled]="isLoading"
              class="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <svg *ngIf="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isLoading ? 'Autenticando en EduCore...' : 'Entrar a la Plataforma' }}</span>
            </button>
          </form>

          <!-- QUICK DEMO ACCESS SECTION -->
          <div class="mt-8 pt-8 border-t border-slate-800">
            <div class="flex items-center justify-between mb-4">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Acceso Rápido Demo (1 Clic)</span>
              <span class="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded font-mono border border-blue-800">Prueba de Roles</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <!-- Admin Demo Button -->
              <button
                type="button"
                (click)="quickLogin('admin@zegel.edu.pe')"
                class="p-3 text-left rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/60 hover:border-purple-600 transition-all duration-200 group"
              >
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-purple-300 group-hover:text-purple-200">Administrador</span>
                  <span class="w-2 h-2 rounded-full bg-purple-400"></span>
                </div>
                <p class="text-[11px] text-slate-400 mt-1 truncate">admin&#64;zegel.edu.pe</p>
                <p class="text-[10px] text-purple-300/70 mt-1 font-mono">CRUD Total + KPIs</p>
              </button>

              <!-- Teacher Demo Button -->
              <button
                type="button"
                (click)="quickLogin('profesor@zegel.edu.pe')"
                class="p-3 text-left rounded-xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-800/60 hover:border-blue-600 transition-all duration-200 group"
              >
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-blue-300 group-hover:text-blue-200">Profesor</span>
                  <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                </div>
                <p class="text-[11px] text-slate-400 mt-1 truncate">profesor&#64;zegel.edu.pe</p>
                <p class="text-[10px] text-blue-300/70 mt-1 font-mono">Sílabos y Dictado</p>
              </button>

              <!-- Student Demo Button -->
              <button
                type="button"
                (click)="quickLogin('estudiante@zegel.edu.pe')"
                class="p-3 text-left rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/60 hover:border-emerald-600 transition-all duration-200 group"
              >
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-emerald-300 group-hover:text-emerald-200">Estudiante</span>
                  <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
                <p class="text-[11px] text-slate-400 mt-1 truncate">estudiante&#64;zegel.edu.pe</p>
                <p class="text-[10px] text-emerald-300/70 mt-1 font-mono">Tarjetas + Avance</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  authService = inject(AuthService);
  toastService = inject(ToastService);
  router = inject(Router);

  email = 'admin@zegel.edu.pe';
  password = 'password123';
  isLoading = false;

  onSubmit(): void {
    if (!this.email) {
      this.toastService.warning('Campos incompletos', 'Por favor ingresa un correo.');
      return;
    }

    this.isLoading = true;
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res: AuthResponse) => {
        this.isLoading = false;
        this.toastService.success('¡Bienvenido(a)!', `Sesión iniciada como ${res.user.name} (${res.user.role})`);
        this.router.navigate(['/dashboard']);
      },
      error: (err: { error?: { message?: string } }) => {
        this.isLoading = false;
        this.toastService.error('Error de Acceso', err.error?.message || 'Usuario no encontrado');
      }
    });
  }

  quickLogin(email: string): void {
    this.email = email;
    this.password = 'password123';
    this.onSubmit();
  }
}
