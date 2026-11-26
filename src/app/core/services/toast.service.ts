import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  show(type: 'success' | 'error' | 'info' | 'warning', title: string, message: string, duration = 3500) {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, type, title, message, duration };
    const current = this.toastsSubject.getValue();
    this.toastsSubject.next([...current, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  success(title: string, message: string) {
    this.show('success', title, message);
  }

  error(title: string, message: string) {
    this.show('error', title, message);
  }

  info(title: string, message: string) {
    this.show('info', title, message);
  }

  warning(title: string, message: string) {
    this.show('warning', title, message);
  }

  remove(id: string) {
    const current = this.toastsSubject.getValue().filter(t => t.id !== id);
    this.toastsSubject.next(current);
  }
}
