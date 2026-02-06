import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { animate, style, transition, trigger, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  animations: [
    trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('100ms', [
            animate('600ms cubic-bezier(0.2, 0.8, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true }),
        query(':leave', [
          animate('400ms ease-in', style({ opacity: 0, transform: 'translateX(30px)' }))
        ], { optional: true })
      ])
    ])
  ]
})
export class CartComponent {
  isProcessing = false;
  selectedPayment: string | null = null;
  paymentMethods = [
    { id: 'visa', name: 'Visa' },
    { id: 'mastercard', name: 'MasterCard' },
    { id: 'amex', name: 'Amex' },
    { id: 'paypal', name: 'PayPal' },
    { id: 'payoneer', name: 'Payoneer' }
  ];

  constructor(
    public cartService: CartService,
    private dataService: DataService,
    private authService: AuthService,
    private router: Router
  ) {}

  removeItem(id: string) {
    this.cartService.removeFromCart(id);
  }

  getFormattedTotal(): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.cartService.getTotalPrice());
  }

  onCheckout() {
    if (!this.authService.isAuthenticated()) return;
    
    this.isProcessing = true;
    const orderData = {
      items: this.cartService.cartItems(),
      total: this.cartService.getTotalPrice()
    };

    this.dataService.createOrder(orderData).subscribe({
      next: () => {
        this.cartService.clearCart();
        alert('Acquisition request submitted successfully. Our curator will contact you shortly.');
        this.router.navigate(['/']);
      },
      error: () => {
        alert('Failed to process acquisition. Please try again.');
        this.isProcessing = false;
      }
    });
  }
}
