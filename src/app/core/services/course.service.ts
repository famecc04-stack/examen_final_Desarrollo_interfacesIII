import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { Course } from '../models';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private readonly baseUrl = '/api/courses';
  private coursesSubject = new BehaviorSubject<Course[]>([]);
  public courses$ = this.coursesSubject.asObservable();

  public get coursesSubjectValue(): Course[] {
    return this.coursesSubject.getValue();
  }

  constructor(private http: HttpClient, private toast: ToastService) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.baseUrl).pipe(
      tap(courses => this.coursesSubject.next(courses)),
      catchError(err => {
        this.toast.error('Error', 'No se pudieron cargar los cursos');
        return throwError(() => err);
      })
    );
  }

  getCourseById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.baseUrl}/${id}`).pipe(
      catchError(err => {
        this.toast.error('Error', `Curso no encontrado (${id})`);
        return throwError(() => err);
      })
    );
  }

  createCourse(course: Omit<Course, 'id' | 'enrolledStudentsCount'>): Observable<Course> {
    return this.http.post<Course>(this.baseUrl, course).pipe(
      tap(created => {
        const current = this.coursesSubject.getValue();
        this.coursesSubject.next([created, ...current]);
        this.toast.success('Éxito', `Curso "${created.title}" creado satisfactoriamente`);
      }),
      catchError(err => {
        this.toast.error('Error', 'Fallo al registrar curso');
        return throwError(() => err);
      })
    );
  }

  updateCourse(id: string, course: Partial<Course>): Observable<Course> {
    return this.http.put<Course>(`${this.baseUrl}/${id}`, course).pipe(
      tap(updated => {
        const current = this.coursesSubject.getValue();
        const index = current.findIndex(c => c.id === id);
        if (index !== -1) {
          const newList = [...current];
          newList[index] = updated;
          this.coursesSubject.next(newList);
        }
        this.toast.success('Actualizado', `Curso "${updated.title}" actualizado`);
      }),
      catchError(err => {
        this.toast.error('Error', 'No se pudo actualizar el curso');
        return throwError(() => err);
      })
    );
  }

  deleteCourse(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        const current = this.coursesSubject.getValue();
        this.coursesSubject.next(current.filter(c => c.id !== id));
        this.toast.info('Eliminado', 'Curso eliminado del catálogo');
      }),
      catchError(err => {
        this.toast.error('Error', 'No se pudo eliminar el curso');
        return throwError(() => err);
      })
    );
  }
}
