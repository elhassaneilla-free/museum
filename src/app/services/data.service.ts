import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  constructor(private http: HttpClient) {}

  // Paintings
  getPaintings(): Observable<Painting[]> {
    return this.http.get<Painting[]>(`${this.apiUrl}/paintings`);
  }

  createPainting(painting: Partial<Painting>): Observable<Painting> {
    return this.http.post<Painting>(`${this.apiUrl}/paintings`, painting);
  }

  updatePainting(id: number, painting: Partial<Painting>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/paintings/${id}`, painting);
  }

  deletePainting(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/paintings/${id}`);
  }

  // Users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user);
  }

  updateUser(id: number, user: Partial<User>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/users/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }

  // Orders
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`);
  }

  createOrder(order: { items: any[], total: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/orders`, order);
  }

  updateOrderStatus(id: number, status: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/orders/${id}/status`, { status });
  }
}
