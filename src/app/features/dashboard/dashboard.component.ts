import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CourseService } from '../../core/services/course.service';
import { UserService } from '../../core/services/user.service';
import { Course, Role, User } from '../../core/models';
import { RoleBadgePipe } from '../../shared/pipes/role-badge.pipe';
import { CourseStatusPipe } from '../../shared/pipes/course-status.pipe';
import { HasRoleDirective } from '../../shared/directives/has-role.directive';
import { HighlightRowDirective } from '../../shared/directives/highlight-row.directive';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RoleBadgePipe,
    CourseStatusPipe,
    HasRoleDirective,
    HighlightRowDirective
  ],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto" *ngIf="authService.currentUser$ | async as currentUser">
      <!-- HEADER BANNER WELCOME -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-blue-900 p-6 md:p-8 text-white shadow-xl border border-indigo-800/40">
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Portal EduCore Zegel
              </span>
              <span [ngClass]="(currentUser.role | roleBadge).bgClass + ' ' + (currentUser.role | roleBadge).textClass" class="text-xs px-2 py-0.5 rounded font-bold">
                {{ (currentUser.role | roleBadge).label }}
              </span>
            </div>
            <h1 class="text-2xl md:text-3xl font-black tracking-tight">
              ¡Hola, {{ currentUser.name }}! 👋
            </h1>
            <p class="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              <ng-container [ngSwitch]="currentUser.role">
                <span *ngSwitchCase="'admin'">Panel de Control Estratégico. Supervisa métricas institucionales, docentes, matriculados y el catálogo formativo general.</span>
                <span *ngSwitchCase="'profesor'">Entorno de Gestión Docente. Revisa tus asignaturas asignadas, actualiza el plan de estudios y monitorea la asistencia.</span>
                <span *ngSwitchCase="'estudiante'">Espacio Académico Personal. Explora tus materias matriculadas, calificaciones, sílabos y avance porcentual del semestre.</span>
              </ng-container>
            </p>
          </div>

          <div class="flex items-center gap-3">
            <a
              routerLink="/dashboard/cursos"
              class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              <span>Ver Cursos</span>
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- ================= 1. INTERFAZ ROL ADMIN ================= -->
      <div *appHasRole="['admin']" class="space-y-6">
        <!-- KPI METRICS GRID -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Total Cursos -->
          <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between text-slate-500 mb-2">
              <span class="text-xs font-semibold uppercase tracking-wider">Cursos Registrados</span>
              <div class="p-2 rounded-xl bg-blue-50 text-blue-600">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <div class="text-2xl font-black text-slate-900 dark:text-white">{{ courses.length }}</div>
            <span class="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <span>↑ 100% Catálogo sincronizado</span>
            </span>
          </div>

          <!-- Total Usuarios -->
          <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between text-slate-500 mb-2">
              <span class="text-xs font-semibold uppercase tracking-wider">Usuarios Activos</span>
              <div class="p-2 rounded-xl bg-purple-50 text-purple-600">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div class="text-2xl font-black text-slate-900 dark:text-white">{{ users.length }}</div>
            <span class="text-[11px] text-slate-500 mt-1 block">Estudiantes, docentes y administradores</span>
          </div>

          <!-- Estudiantes Matriculados -->
          <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between text-slate-500 mb-2">
              <span class="text-xs font-semibold uppercase tracking-wider">Total Matrículas</span>
              <div class="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
            <div class="text-2xl font-black text-slate-900 dark:text-white">{{ totalEnrollments }}</div>
            <span class="text-[11px] text-emerald-600 font-semibold mt-1 block">Alta demanda semestral</span>
          </div>

          <!-- Ocupabilidad -->
          <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between text-slate-500 mb-2">
              <span class="text-xs font-semibold uppercase tracking-wider">Ocupabilidad Aulas</span>
              <div class="p-2 rounded-xl bg-amber-50 text-amber-600">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div class="text-2xl font-black text-slate-900 dark:text-white">{{ capacityAverage }}%</div>
            <div class="w-full bg-slate-100 rounded-full h-1.5 mt-2">
              <div class="bg-amber-500 h-1.5 rounded-full" [style.width.%]="capacityAverage"></div>
            </div>
          </div>
        </div>

        <!-- RECENT COURSES TABLE WITH HIGHLIGHT DIRECTIVE -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white">Últimos Cursos Gestionados</h3>
              <p class="text-xs text-slate-500">Asignaturas activas y recientes del periodo académico</p>
            </div>
            <a routerLink="/dashboard/cursos" class="text-xs text-blue-600 hover:text-blue-700 font-bold">Ver todos →</a>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                  <th class="py-3 px-4">Código & Asignatura</th>
                  <th class="py-3 px-4">Docente</th>
                  <th class="py-3 px-4">Créditos</th>
                  <th class="py-3 px-4">Estado</th>
                  <th class="py-3 px-4">Capacidad</th>
                  <th class="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                <tr *ngFor="let course of courses" appHighlightRow class="group cursor-pointer">
                  <td class="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    <span class="text-[10px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded mr-1.5">{{ course.code }}</span>
                    {{ course.title }}
                  </td>
                  <td class="py-3.5 px-4 text-slate-600 dark:text-slate-400">{{ course.instructorName }}</td>
                  <td class="py-3.5 px-4 font-mono font-bold">{{ course.credits }} pts</td>
                  <td class="py-3.5 px-4">
                    <span
                      [ngClass]="(course.status | courseStatus).badgeClass"
                      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border"
                    >
                      <span class="w-1.5 h-1.5 rounded-full" [ngClass]="(course.status | courseStatus).dotClass"></span>
                      {{ (course.status | courseStatus).label }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 text-slate-600">
                    {{ course.enrolledStudentsCount }} / {{ course.maxCapacity }}
                  </td>
                  <td class="py-3.5 px-4 text-right">
                    <a [routerLink]="['/dashboard/cursos', course.id]" class="text-indigo-600 hover:text-indigo-800 font-bold text-xs">
                      Detalles
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ================= 2. INTERFAZ ROL PROFESOR ================= -->
      <div *appHasRole="['profesor']" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span class="text-xs font-semibold text-slate-500 uppercase">Mis Asignaturas a Cargo</span>
            <div class="text-2xl font-black text-blue-600 mt-1">{{ teacherCourses.length }} cursos</div>
            <p class="text-xs text-slate-500 mt-1">Horarios asignados semestre 2026-I</p>
          </div>
          <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span class="text-xs font-semibold text-slate-500 uppercase">Alumnos en mis Grupos</span>
            <div class="text-2xl font-black text-emerald-600 mt-1">{{ teacherStudentsCount }} estudiantes</div>
            <p class="text-xs text-slate-500 mt-1">Total de asistencia consolidada</p>
          </div>
          <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span class="text-xs font-semibold text-slate-500 uppercase">Sílabos y Recursos</span>
            <div class="text-2xl font-black text-indigo-600 mt-1">100% Al día</div>
            <p class="text-xs text-slate-500 mt-1">Planificaciones aprobadas por coordinación</p>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 class="text-base font-bold text-slate-900 dark:text-white mb-4">Cursos Dictados por {{ currentUser.name }}</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div *ngFor="let course of teacherCourses" class="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between">
                  <span class="text-xs font-mono font-bold text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded">{{ course.code }}</span>
                  <span [ngClass]="(course.status | courseStatus).badgeClass" class="text-[11px] px-2 py-0.5 rounded border">
                    {{ (course.status | courseStatus).label }}
                  </span>
                </div>
                <h4 class="text-sm font-bold text-slate-900 mt-2">{{ course.title }}</h4>
                <p class="text-xs text-slate-600 mt-1 line-clamp-2">{{ course.description }}</p>
                <div class="mt-3 text-[11px] text-slate-500 flex items-center gap-4">
                  <span>📅 {{ course.schedule }}</span>
                  <span>👥 {{ course.enrolledStudentsCount }} matriculados</span>
                </div>
              </div>

              <div class="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-500">Sílabo: {{ course.syllabus?.length || 0 }} módulos</span>
                <a [routerLink]="['/dashboard/cursos', course.id]" class="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700">
                  Gestionar Sílabo
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= 3. INTERFAZ ROL ESTUDIANTE ================= -->
      <div *appHasRole="['estudiante']" class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Mis Asignaturas Matriculadas</h3>
            <p class="text-xs text-slate-500">Formato de tarjetas modernas con progreso académico en vivo.</p>
          </div>
          <span class="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-300">
            Semestre Regular 2026-I · 4to Ciclo
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            *ngFor="let course of courses"
            class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div class="h-36 w-full relative overflow-hidden bg-slate-950">
                <img [src]="course.coverImage" [alt]="course.title" class="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-500" />
                <div class="absolute top-3 left-3">
                  <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950/80 text-white backdrop-blur-sm">
                    {{ course.code }}
                  </span>
                </div>
                <div class="absolute top-3 right-3">
                  <span [ngClass]="(course.status | courseStatus).badgeClass" class="px-2 py-0.5 rounded text-[10px] font-bold border backdrop-blur-md">
                    {{ (course.status | courseStatus).label }}
                  </span>
                </div>
              </div>

              <div class="p-5">
                <h4 class="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{{ course.title }}</h4>
                <p class="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{{ course.description }}</p>

                <div class="mt-4 space-y-2">
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-slate-500">Profesor:</span>
                    <span class="font-semibold text-slate-700 dark:text-slate-300">{{ course.instructorName }}</span>
                  </div>
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-slate-500">Horario:</span>
                    <span class="text-slate-600 text-[11px]">{{ course.schedule }}</span>
                  </div>

                  <!-- Barra de Progreso Académico -->
                  <div class="pt-2">
                    <div class="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                      <span>Progreso del Curso</span>
                      <span class="text-blue-600">{{ course.progressPercentage || 0 }}%</span>
                    </div>
                    <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        class="h-2 rounded-full transition-all duration-500"
                        [ngClass]="{
                          'bg-emerald-500': (course.progressPercentage || 0) >= 70,
                          'bg-blue-500': (course.progressPercentage || 0) >= 30 && (course.progressPercentage || 0) < 70,
                          'bg-amber-500': (course.progressPercentage || 0) < 30
                        }"
                        [style.width.%]="course.progressPercentage || 0"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span class="text-xs font-bold text-slate-500">{{ course.credits }} Créditos</span>
              <a
                [routerLink]="['/dashboard/cursos', course.id]"
                class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
              >
                Ver Aula Virtual
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  private courseService = inject(CourseService);
  private userService = inject(UserService);

  courses: Course[] = [];
  users: User[] = [];

  ngOnInit(): void {
    // 1. Cargar cursos desde CourseService
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
      },
      error: () => {
        this.courses = this.courseService.coursesSubjectValue;
      }
    });

    // 2. Cargar usuarios desde UserService
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: () => {
        this.users = this.userService.usersSubjectValue;
      }
    });
  }

  get totalEnrollments(): number {
    return this.courses.reduce((acc, c) => acc + (c.enrolledStudentsCount || 0), 0);
  }

  get capacityAverage(): number {
    if (!this.courses.length) return 0;
    const totalMax = this.courses.reduce((acc, c) => acc + (c.maxCapacity || 1), 0);
    return Math.round((this.totalEnrollments / totalMax) * 100);
  }

  get teacherCourses(): Course[] {
    const user = this.authService.currentUserValue;
    if (!user) return [];
    return this.courses.filter(c => c.instructorId === user.id || c.instructorName.includes(user.name) || user.role === 'profesor');
  }

  get teacherStudentsCount(): number {
    return this.teacherCourses.reduce((acc, c) => acc + (c.enrolledStudentsCount || 0), 0);
  }
}
