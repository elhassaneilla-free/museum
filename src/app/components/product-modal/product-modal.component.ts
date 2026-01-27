import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { animate, style, transition, trigger } from '@angular/animations';

interface Variant {
  name: string;
  size: string;
  price: string;
  image: string;
}

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-modal.component.html',
  animations: [
    trigger('modalFade', [
      transition(':enter', [
        style({ opacity: 0, scale: 0.95 }),
        animate('800ms cubic-bezier(0.2, 0.8, 0.2, 1)', style({ opacity: 1, scale: 1 }))
      ]),
      transition(':leave', [
        animate('600ms cubic-bezier(0.2, 0.8, 0.2, 1)', style({ opacity: 0, scale: 0.95 }))
      ])
    ])
  ],
  styles: [`
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.2);
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(198, 166, 100, 0.3);
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(198, 166, 100, 0.5);
    }
    .custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: rgba(198, 166, 100, 0.3) rgba(0, 0, 0, 0.2);
    }
  `]
})
export class ProductModalComponent {
  @Input() 
  set isOpen(value: boolean) {
    this._isOpen = value;
    if (value) {
      this._selectedVariant = null; // Reset selection on open
    }
  }
  get isOpen(): boolean {
    return this._isOpen;
  }
  private _isOpen = false;

  @Input() artistName = '';
  @Input() productName = '';
  @Input() productDescription = '';
  @Input() productMainImage = '';
  @Input() productPrice = '';
  
  @Output() close = new EventEmitter<void>();

  private _selectedVariant: Variant | null = null;

  get variants(): Variant[] {
    const basePrice = parseFloat(this.productPrice.replace(/[^0-9]/g, '')) || 0;
    const isPriceless = this.productPrice.toLowerCase().includes('priceless');
    
    const format = (val: number) => {
      if (isPriceless) return 'Priceless';
      return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
    };

    return [
      { name: 'Original Vision', size: 'Small (24x36)', price: isPriceless ? 'Priceless' : this.productPrice, image: this.productMainImage },
      { name: 'Institutional Scale', size: 'Medium (48x72)', price: format(basePrice * 1.8), image: this.productMainImage },
      { name: 'Grand Master', size: 'Large (96x144)', price: format(basePrice * 3.2), image: this.productMainImage }
    ];
  }

  get selectedVariant(): Variant {
    return this._selectedVariant || this.variants[0];
  }

  constructor(
    public cartService: CartService,
    public authService: AuthService,
    private notificationService: NotificationService
  ) {}

  selectVariant(variant: Variant) {
    this._selectedVariant = variant;
  }

  addToCart() {
    if (!this.authService.isAuthenticated()) return;

    this.cartService.addToCart({
      name: this.productName,
      artist: this.artistName,
      variant: this.selectedVariant.size,
      price: this.selectedVariant.price,
      image: this.selectedVariant.image
    });

    this.notificationService.show(this.productName, this.artistName);
  }
}
