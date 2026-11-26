import { Pipe, PipeTransform } from '@angular/core';
import { Role } from '../../core/models';

@Pipe({
  name: 'roleBadge',
  standalone: true
})
export class RoleBadgePipe implements PipeTransform {
  transform(role: Role | string | undefined): { label: string; bgClass: string; textClass: string; icon: string } {
    switch (role) {
      case 'admin':
        return {
          label: 'Administrador',
          bgClass: 'bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800',
          textClass: 'text-purple-700 dark:text-purple-300',
          icon: 'shield-check'
        };
      case 'profesor':
        return {
          label: 'Docente / Profesor',
          bgClass: 'bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800',
          textClass: 'text-blue-700 dark:text-blue-300',
          icon: 'academic-cap'
        };
      case 'estudiante':
        return {
          label: 'Estudiante',
          bgClass: 'bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800',
          textClass: 'text-emerald-700 dark:text-emerald-300',
          icon: 'user-group'
        };
      default:
        return {
          label: role || 'Desconocido',
          bgClass: 'bg-slate-100 border border-slate-200',
          textClass: 'text-slate-700',
          icon: 'user'
        };
    }
  }
}
