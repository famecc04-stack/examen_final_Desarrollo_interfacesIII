import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { AuthService } from '../../../core/services/auth.service';
import { Course } from '../../../core/models';
import { CourseStatusPipe } from '../../../shared/pipes/course-status.pipe';
import { HasRoleDirective } from '../../../shared/directives/has-role.directive';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, CourseStatusPipe, HasRoleDirective, FormsModule],
  template: `
    <div class="space-y-6 max-w-5xl mx-auto" *ngIf="course">
      <!-- BREADCRUMBS -->
      <div class="flex items-center gap-2 text-xs text-slate-500">
        <a routerLink="/dashboard" class="hover:text-indigo-600">Inicio</a>
        <span>/</span>
        <a routerLink="/dashboard/cursos" class="hover:text-indigo-600">Cursos</a>
        <span>/</span>
        <span class="text-slate-800 dark:text-slate-300 font-bold">{{ course.code }}</span>
      </div>

      <!-- COURSE HERO CARD -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-lg">
        <div class="relative h-64 w-full bg-slate-950">
          <img [src]="course.coverImage" [alt]="course.title" class="w-full h-full object-cover opacity-80" />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          
          <div class="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4 text-white">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-blue-600 text-white shadow-sm">
                  {{ course.code }}
                </span>
                <span [ngClass]="(course.status | courseStatus).badgeClass" class="px-2.5 py-0.5 rounded text-xs font-bold border backdrop-blur-md">
                  {{ (course.status | courseStatus).label }}
                </span>
              </div>
              <h1 class="text-2xl md:text-3xl font-black">{{ course.title }}</h1>
              <p class="text-xs text-slate-300 mt-1">Docente Principal: <span class="font-bold text-white">{{ course.instructorName }}</span></p>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-xs bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 font-mono">
                {{ course.credits }} Créditos Académicos
              </span>
            </div>
          </div>
        </div>

        <div class="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Main Details -->
          <div class="md:col-span-2 space-y-6">
            <div>
              <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Sumilla y Objetivos</h3>
              <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{{ course.description }}</p>
            </div>

            <!-- Sílabo Interactivo -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Unidades y Sílabo</h3>
                <button
                  *appHasRole="['admin', 'profesor']"
                  (click)="showAddSyllabus = !showAddSyllabus"
                  class="text-xs text-indigo-600 font-bold hover:underline"
                >
                  {{ showAddSyllabus ? 'Cancelar' : '+ Agregar Módulo' }}
                </button>
              </div>

              <!-- Input agregar nuevo item al sílabo -->
              <div *ngIf="showAddSyllabus" class="flex gap-2 mb-3">
                <input
                  type="text"
                  [(ngModel)]="newModuleText"
                  placeholder="Ej: Semana 15: Presentación de Proyectos Finales"
                  class="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-950"
                />
                <button
                  (click)="addSyllabusItem()"
                  class="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold"
                >
                  Guardar
                </button>
              </div>

              <div class="space-y-2.5">
                <div
                  *ngFor="let item of course.syllabus; let i = index"
                  class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3"
                >
                  <span class="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {{ i + 1 }}
                  </span>
                  <div class="flex-1 text-xs text-slate-700 dark:text-slate-300 font-medium">
                    {{ item }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Side Metadata Bento -->
          <div class="space-y-4">
            <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500">Información del Dictado</h4>
              
              <div class="text-xs">
                <span class="text-slate-400 block">Horario Semanal:</span>
                <span class="font-semibold text-slate-800 dark:text-slate-200">{{ course.schedule }}</span>
              </div>

              <div class="text-xs">
                <span class="text-slate-400 block">Capacidad de Alumnos:</span>
                <span class="font-semibold text-slate-800 dark:text-slate-200">{{ course.enrolledStudentsCount }} matriculados / {{ course.maxCapacity }} max</span>
              </div>

              <!-- Student Progress if Applicable -->
              <div class="pt-2 border-t border-slate-200 dark:border-slate-800">
                <span class="text-xs text-slate-400 block mb-1">Avance Curricular</span>
                <div class="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                  <div class="bg-indigo-600 h-2 rounded-full" [style.width.%]="course.progressPercentage || 60"></div>
                </div>
                <span class="text-[10px] text-indigo-600 font-bold block text-right mt-1">{{ course.progressPercentage || 60 }}% completado</span>
              </div>
            </div>

            <div class="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 text-xs">
              <p class="font-bold text-blue-900 dark:text-blue-300">Campus Zegel Virtual</p>
              <p class="text-slate-600 dark:text-slate-400 text-[11px] mt-1">
                Las sesiones y grabaciones se encuentran integradas en la nube de EduCore.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CourseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  authService = inject(AuthService);

  course?: Course;
  showAddSyllabus = false;
  newModuleText = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.courseService.getCourseById(id).subscribe(data => {
        this.course = data;
      });
    }
  }

  addSyllabusItem(): void {
    if (!this.newModuleText.trim() || !this.course) return;
    const currentSyllabus = this.course.syllabus || [];
    const updatedSyllabus = [...currentSyllabus, this.newModuleText.trim()];
    
    this.courseService.updateCourse(this.course.id, { syllabus: updatedSyllabus }).subscribe(updated => {
      this.course = updated;
      this.newModuleText = '';
      this.showAddSyllabus = false;
    });
  }
}
