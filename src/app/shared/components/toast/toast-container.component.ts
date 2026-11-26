import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <div
        *ngFor="let toast of toastService.toasts$ | async"
        [ngClass]="{
          'bg-white border-l-4 border-emerald-500 shadow-xl': toast.type === 'success',
          'bg-white border-l-4 border-rose-500 shadow-xl': toast.type === 'error',
          'bg-white border-l-4 border-blue-500 shadow-xl': toast.type === 'info',
          'bg-white border-l-4 border-amber-500 shadow-xl': toast.type === 'warning'
        }"
        class="pointer-events-auto rounded-xl p-4 shadow-lg flex items-start gap-3 transition-all duration-300 animate-slide-in border border-slate-100"
      >
        <!-- Icon -->
        <div class="flex-shrink-0 mt-0.5">
          <svg *ngIf="toast.type === 'success'" class="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg *ngIf="toast.type === 'error'" class="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg *ngIf="toast.type === 'info'" class="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg *ngIf="toast.type === 'warning'" class="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <!-- Body -->
        <div class="flex-1">
          <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider">{{ toast.title }}</h4>
          <p class="text-xs text-slate-600 mt-0.5 leading-relaxed">{{ toast.message }}</p>
        </div>

        <!-- Close -->
        <button
          (click)="toastService.remove(toast.id)"
          class="text-slate-400 hover:text-slate-600 transition-colors p-1"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  `
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}
