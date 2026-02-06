import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface Painting {
  id: number;
  title: string;
  artist: string;
  description: string;
  price: string;
  image: string;
  category: string;
  availability: number;
}

export interface User {
  id: number;
  username: string;
  role: string;
  status: string;
  password?: string;
}

export interface Order {
  id: number;
  userId: number;
  user?: string;
  total: number;
  status: string;
  date: string;
  items: any[];
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://127.0.0.1:3000/api';

  // State Management with Signals
  private _paintings = signal<Painting[]>([]);
  private _users = signal<User[]>([]);
  private _orders = signal<Order[]>([]);

  // Public Read-only Signals
  paintings = this._paintings.asReadonly();
  users = this._users.asReadonly();
  orders = this._orders.asReadonly();

  constructor(private http: HttpClient) {}

  // Paintings
  getPaintings(): Observable<Painting[]> {
    return this.http.get<Painting[]>(`${this.apiUrl}/paintings`).pipe(
      tap(data => this._paintings.set(data))
    );
  }

  // Force refresh signals
  refreshPaintings() {
    this.getPaintings().subscribe();
  }

  createPainting(painting: Partial<Painting>): Observable<Painting> {
    return this.http.post<Painting>(`${this.apiUrl}/paintings`, painting).pipe(
      tap(() => this.refreshPaintings())
    );
  }

  updatePainting(id: number, painting: Partial<Painting>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/paintings/${id}`, painting).pipe(
      tap(() => this.refreshPaintings())
    );
  }

  deletePainting(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/paintings/${id}`).pipe(
      tap(() => this.refreshPaintings())
    );
  }

  // Users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      tap(data => this._users.set(data))
    );
  }

  refreshUsers() {
    this.getUsers().subscribe();
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user).pipe(
      tap(() => this.refreshUsers())
    );
  }

  updateUser(id: number, user: Partial<User>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/users/${id}`, user).pipe(
      tap(() => this.refreshUsers())
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`).pipe(
      tap(() => this.refreshUsers())
    );
  }

  // Orders
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`).pipe(
      tap(data => this._orders.set(data))
    );
  }

  refreshOrders() {
    this.getOrders().subscribe();
  }

  createOrder(order: { items: any[], total: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/orders`, order).pipe(
      tap(() => this.refreshOrders())
    );
  }

  updateOrderStatus(id: number, status: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/orders/${id}/status`, { status }).pipe(
      tap(() => this.refreshOrders())
    );
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/orders/${id}`).pipe(
      tap(() => this.refreshOrders())
    );
  }

  deleteAllOrders(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/orders`).pipe(
      tap(() => this.refreshOrders())
    );
  }
}
