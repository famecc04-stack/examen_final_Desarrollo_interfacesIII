import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { AuthService } from '../../../core/services/auth.service';
import { Course, CourseStatus } from '../../../core/models';
import { CourseStatusPipe } from '../../../shared/pipes/course-status.pipe';
import { HasRoleDirective } from '../../../shared/directives/has-role.directive';
import { HighlightRowDirective } from '../../../shared/directives/highlight-row.directive';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    CourseStatusPipe,
    HasRoleDirective,
    HighlightRowDirective
  ],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto">
      <!-- HEADER ACTIONS -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Catálogo de Cursos</h2>
          <p class="text-xs text-slate-500">Gestión de oferta académica, programas y mallas curriculares.</p>
        </div>

        <!-- Botón crear curso: Solo para admin o profesor -->
        <button
          *appHasRole="['admin', 'profesor']"
          (click)="openCreateModal()"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Registrar Nuevo Curso
        </button>
      </div>

      <!-- SEARCH & FILTER BAR -->
      <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div class="relative w-full md:w-96">
          <input
            type="text"
            [(ngModel)]="searchTerm"
            placeholder="Buscar por título, código o profesor..."
            class="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div class="flex items-center gap-2 w-full md:w-auto">
          <span class="text-xs text-slate-400 whitespace-nowrap">Filtrar Estado:</span>
          <select
            [(ngModel)]="selectedStatus"
            class="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="todos">Todos</option>
            <option value="activo">En Dictado (Activo)</option>
            <option value="proximo">Próxima Apertura</option>
            <option value="finalizado">Finalizado</option>
          </select>
        </div>
      </div>

      <!-- COURSES TABLE -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-50/70 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                <th class="py-3 px-5">Asignatura</th>
                <th class="py-3 px-5">Docente a Cargo</th>
                <th class="py-3 px-5">Créditos</th>
                <th class="py-3 px-5">Estado</th>
                <th class="py-3 px-5">Inscritos / Límite</th>
                <th class="py-3 px-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr *ngFor="let course of filteredCourses" appHighlightRow class="group">
                <td class="py-4 px-5">
                  <div class="flex items-center gap-3">
                    <img [src]="course.coverImage" [alt]="course.title" class="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    <div>
                      <span class="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{{ course.code }}</span>
                      <h4 class="font-bold text-slate-900 dark:text-white text-xs mt-0.5">{{ course.title }}</h4>
                      <p class="text-[11px] text-slate-400 truncate max-w-xs">{{ course.schedule }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-5 text-slate-600 dark:text-slate-300 font-medium">
                  {{ course.instructorName }}
                </td>
                <td class="py-4 px-5 font-mono font-bold text-slate-700 dark:text-slate-200">
                  {{ course.credits }} pts
                </td>
                <td class="py-4 px-5">
                  <span
                    [ngClass]="(course.status | courseStatus).badgeClass"
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" [ngClass]="(course.status | courseStatus).dotClass"></span>
                    {{ (course.status | courseStatus).label }}
                  </span>
                </td>
                <td class="py-4 px-5">
                  <span class="font-semibold text-slate-800 dark:text-slate-200">{{ course.enrolledStudentsCount }}</span>
                  <span class="text-slate-400"> / {{ course.maxCapacity }}</span>
                </td>
                <td class="py-4 px-5 text-right">
                  <div class="inline-flex items-center gap-2">
                    <a
                      [routerLink]="['/dashboard/cursos', course.id]"
                      class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                    >
                      Ver
                    </a>

                    <!-- Botón Editar: Solo admin o profesor -->
                    <button
                      *appHasRole="['admin', 'profesor']"
                      (click)="openEditModal(course)"
                      class="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors"
                    >
                      Editar
                    </button>

                    <!-- Botón Eliminar: Solo admin -->
                    <button
                      *appHasRole="['admin']"
                      (click)="deleteCourse(course.id)"
                      class="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>

              <tr *ngIf="filteredCourses.length === 0">
                <td colspan="6" class="py-8 text-center text-slate-400 text-xs">
                  No se encontraron cursos que coincidan con la búsqueda.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- MODAL FORMULARIO CREAR / EDITAR CURSO -->
      <div *ngIf="isModalOpen" class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 class="text-base font-bold text-slate-900 dark:text-white">
              {{ editingCourseId ? 'Editar Asignatura' : 'Registrar Nueva Asignatura' }}
            </h3>
            <button (click)="closeModal()" class="text-slate-400 hover:text-slate-600">✕</button>
          </div>

          <form (ngSubmit)="saveCourse()" class="mt-4 space-y-3.5 text-xs">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Código</label>
                <input
                  type="text"
                  [(ngModel)]="formData.code"
                  name="code"
                  required
                  placeholder="Ej: DINT-301"
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
                />
              </div>
              <div>
                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Créditos</label>
                <input
                  type="number"
                  [(ngModel)]="formData.credits"
                  name="credits"
                  required
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Título del Curso</label>
              <input
                type="text"
                [(ngModel)]="formData.title"
                name="title"
                required
                placeholder="Nombre completo de la asignatura"
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Descripción</label>
              <textarea
                [(ngModel)]="formData.description"
                name="description"
                rows="2"
                placeholder="Resumen del curso y competencias a desarrollar"
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Docente Asignado</label>
                <input
                  type="text"
                  [(ngModel)]="formData.instructorName"
                  name="instructorName"
                  required
                  placeholder="Nombre del docente"
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
                />
              </div>
              <div>
                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Estado</label>
                <select
                  [(ngModel)]="formData.status"
                  name="status"
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
                >
                  <option value="activo">En Dictado (Activo)</option>
                  <option value="proximo">Próxima Apertura</option>
                  <option value="finalizado">Finalizado</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Capacidad Máxima</label>
                <input
                  type="number"
                  [(ngModel)]="formData.maxCapacity"
                  name="maxCapacity"
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
                />
              </div>
              <div>
                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Horario de Clases</label>
                <input
                  type="text"
                  [(ngModel)]="formData.schedule"
                  name="schedule"
                  placeholder="Ej: Lun y Mié 19:00 - 21:30"
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            <div class="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                (click)="closeModal()"
                class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/30"
              >
                Guardar Asignatura
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class CourseListComponent implements OnInit {
  private courseService = inject(CourseService);
  authService = inject(AuthService);

  courses: Course[] = [];
  searchTerm = '';
  selectedStatus = 'todos';

  isModalOpen = false;
  editingCourseId: string | null = null;
  formData: Partial<Course> = {
    code: '',
    title: '',
    description: '',
    credits: 4,
    instructorName: '',
    status: 'activo',
    maxCapacity: 30,
    schedule: ''
  };

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe(data => {
      this.courses = data;
    });
  }

  get filteredCourses(): Course[] {
    return this.courses.filter(c => {
      const matchSearch =
        c.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        c.instructorName.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchStatus = this.selectedStatus === 'todos' || c.status === this.selectedStatus;
      return matchSearch && matchStatus;
    });
  }

  openCreateModal(): void {
    this.editingCourseId = null;
    this.formData = {
      code: 'ZEG-' + Math.floor(100 + Math.random() * 900),
      title: '',
      description: '',
      credits: 4,
      instructorName: this.authService.currentUserValue?.name || 'Brayan Flores',
      instructorId: this.authService.currentUserValue?.id || 'u-2',
      status: 'activo',
      maxCapacity: 35,
      schedule: 'Lunes y Miércoles 19:00 - 21:30'
    };
    this.isModalOpen = true;
  }

  openEditModal(course: Course): void {
    this.editingCourseId = course.id;
    this.formData = { ...course };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveCourse(): void {
    if (this.editingCourseId) {
      this.courseService.updateCourse(this.editingCourseId, this.formData).subscribe(() => {
        this.closeModal();
        this.loadCourses();
      });
    } else {
      this.courseService.createCourse(this.formData as Course).subscribe(() => {
        this.closeModal();
        this.loadCourses();
      });
    }
  }

  deleteCourse(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este curso del catálogo institucional?')) {
      this.courseService.deleteCourse(id).subscribe(() => {
        this.loadCourses();
      });
    }
  }
}
