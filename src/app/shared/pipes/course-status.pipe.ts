import { Pipe, PipeTransform } from '@angular/core';
import { CourseStatus } from '../../core/models';

@Pipe({
  name: 'courseStatus',
  standalone: true
})
export class CourseStatusPipe implements PipeTransform {
  transform(status: CourseStatus | string | undefined): { label: string; badgeClass: string; dotClass: string } {
    switch (status) {
      case 'activo':
        return {
          label: 'En Dictado (Activo)',
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
          dotClass: 'bg-emerald-500 animate-pulse'
        };
      case 'proximo':
        return {
          label: 'Próxima Apertura',
          badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
          dotClass: 'bg-amber-500'
        };
      case 'finalizado':
        return {
          label: 'Ciclo Concluido',
          badgeClass: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
          dotClass: 'bg-slate-400'
        };
      default:
        return {
          label: status || 'Desconocido',
          badgeClass: 'bg-gray-100 text-gray-600 border-gray-200',
          dotClass: 'bg-gray-400'
        };
    }
  }
}
