import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

export type UserRole = 'user' | 'admin' | null;

interface LoginResponse {
  role: UserRole;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:3000/api';
  currentUser = signal<LoginResponse | null>(this.getStoredUser());

  constructor(private http: HttpClient, private router: Router) {}

  private getStoredUser(): LoginResponse | null {
    const user = localStorage.getItem('victoria_user');
    return user ? JSON.parse(user) : null;
  }

  login(username: string, password: string, isAdmin: boolean = false) {
    console.log(`Attempting login for ${username} at ${this.apiUrl}/login`);
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap({
        next: (response) => console.log('Login successful:', response),
        error: (err) => console.error('Login failed:', err)
      }),
      tap(response => {
        localStorage.setItem('victoria_user', JSON.stringify(response));
        this.currentUser.set(response);
      })
    );
  }

  logout() {
    localStorage.removeItem('victoria_user');
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }

  isUser(): boolean {
    return this.currentUser()?.role === 'user';
  }

  isAuthenticated(): boolean {
    return !!this.currentUser();
  }
}
