import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthResponse, JwtPayload, Role, User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'educore_token';
  private readonly USER_KEY = 'educore_user';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  public get currentUserValue(): User | null {
    return this.currentUserSubject.getValue();
  }

  public get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public get role(): Role | null {
    return this.currentUserValue ? this.currentUserValue.role : null;
  }

  login(credentials: { email: string; password?: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', credentials).pipe(
      tap(response => {
        this.saveAuth(response.token, response.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    const token = this.token;
    if (!token) return false;

    const payload = this.decodeToken(token);
    if (!payload) return false;

    // Check expiration (timestamp in seconds)
    const isExpired = payload.exp * 1000 < Date.now();
    if (isExpired) {
      this.logout();
      return false;
    }
    return true;
  }

  hasRole(expectedRoles: Role[]): boolean {
    const userRole = this.role;
    if (!userRole) return false;
    return expectedRoles.includes(userRole);
  }

  decodeToken(token: string): JwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload) as JwtPayload;
    } catch {
      return null;
    }
  }

  private saveAuth(token: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private getStoredUser(): User | null {
    const stored = localStorage.getItem(this.USER_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as User;
    } catch {
      return null;
    }
  }
}
