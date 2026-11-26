import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { User } from '../models';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = '/api/users';
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  public get usersSubjectValue(): User[] {
    return this.usersSubject.getValue();
  }

  constructor(private http: HttpClient, private toast: ToastService) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl).pipe(
      tap(users => this.usersSubject.next(users)),
      catchError(err => {
        this.toast.error('Error', 'No se pudieron cargar los usuarios');
        return throwError(() => err);
      })
    );
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`).pipe(
      catchError(err => {
        this.toast.error('Error', `Usuario con ID ${id} no encontrado`);
        return throwError(() => err);
      })
    );
  }

  createUser(user: Omit<User, 'id' | 'createdAt'>): Observable<User> {
    return this.http.post<User>(this.baseUrl, user).pipe(
      tap(created => {
        const current = this.usersSubject.getValue();
        this.usersSubject.next([created, ...current]);
        this.toast.success('Éxito', `Usuario ${created.name} registrado correctamente`);
      }),
      catchError(err => {
        this.toast.error('Error', 'Fallo al crear usuario');
        return throwError(() => err);
      })
    );
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, user).pipe(
      tap(updated => {
        const current = this.usersSubject.getValue();
        const index = current.findIndex(u => u.id === id);
        if (index !== -1) {
          const newList = [...current];
          newList[index] = updated;
          this.usersSubject.next(newList);
        }
        this.toast.success('Actualizado', `Usuario ${updated.name} modificado`);
      }),
      catchError(err => {
        this.toast.error('Error', 'No se pudo actualizar el usuario');
        return throwError(() => err);
      })
    );
  }

  deleteUser(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        const current = this.usersSubject.getValue();
        this.usersSubject.next(current.filter(u => u.id !== id));
        this.toast.info('Eliminado', 'Usuario retirado de la plataforma');
      }),
      catchError(err => {
        this.toast.error('Error', 'No se pudo eliminar el usuario');
        return throwError(() => err);
      })
    );
  }
}
