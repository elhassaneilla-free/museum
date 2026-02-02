import { Injectable, signal, effect } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';

import { CartService } from './cart.service';

export type UserRole = 'user' | 'admin' | null;

export interface AuthState {
  username: string;
  role: UserRole;
  token: string;
  isAuthenticated: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:3000/api';
  private state = signal<AuthState | null>(this.loadFromStorage());

  currentUser = this.state.asReadonly();

  constructor(
    private router: Router, 
    private cartService: CartService,
    private http: HttpClient
  ) {
    effect(() => {
      const currentState = this.state();
      if (currentState) {
        localStorage.setItem('victoria_auth', JSON.stringify(currentState));
      } else {
        localStorage.removeItem('victoria_auth');
      }
    });
  }

  private loadFromStorage(): AuthState | null {
    const saved = localStorage.getItem('victoria_auth');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }

  login(username: string, password: string) {
    return this.http.post<{ token: string; username: string; role: UserRole }>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(res => {
        const newState: AuthState = {
          username: res.username,
          role: res.role,
          token: res.token,
          isAuthenticated: true
        };
        this.state.set(newState);
      })
    );
  }

  logout() {
    this.state.set(null);
    this.cartService.clearCart();
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return this.state()?.token || null;
  }

  isAdmin(): boolean {
    const state = this.state();
    return !!state && state.isAuthenticated && state.role === 'admin';
  }

  isUser(): boolean {
    const state = this.state();
    return !!state && state.isAuthenticated && state.role === 'user';
  }

  isAuthenticated(): boolean {
    const state = this.state();
    return !!state && state.isAuthenticated;
  }
}
