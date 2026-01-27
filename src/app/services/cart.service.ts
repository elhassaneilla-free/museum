import { Injectable, signal, effect } from '@angular/core';

export interface CartItem {
  id: string;
  name: string;
  artist: string;
  variant: string;
  price: string;
  quantity: number;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items = signal<CartItem[]>(this.loadCart());

  cartItems = this.items.asReadonly();

  constructor() {
    effect(() => {
      localStorage.setItem('victoria_cart', JSON.stringify(this.items()));
    });
  }

  private loadCart(): CartItem[] {
    const saved = localStorage.getItem('victoria_cart');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse cart from localStorage', e);
      return [];
    }
  }

  addToCart(item: Omit<CartItem, 'id' | 'quantity'>) {
    this.items.update(currentItems => {
      const existing = currentItems.find(i => i.name === item.name && i.variant === item.variant);
      if (existing) {
        return currentItems.map(i => i === existing ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...currentItems, { ...item, id: Math.random().toString(36).substr(2, 9), quantity: 1 }];
    });
  }

  removeFromCart(id: string) {
    this.items.update(items => items.filter(i => i.id !== id));
  }

  clearCart() {
    this.items.set([]);
  }

  getTotalCount() {
    return this.items().reduce((acc, item) => acc + item.quantity, 0);
  }

  getTotalPrice() {
    return this.items().reduce((acc, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
      return acc + (price * item.quantity);
    }, 0);
  }
}
