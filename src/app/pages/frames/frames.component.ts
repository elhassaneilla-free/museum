import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ProductModalComponent } from '../../components/product-modal/product-modal.component';

interface FrameProduct {
  name: string;
  image: string;
  description: string;
  price: string;
  layout: 'portrait' | 'landscape';
}

@Component({
  selector: 'app-frames',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductModalComponent],
  templateUrl: './frames.component.html',
  styles: []
})
export class FramesComponent {
  frames: FrameProduct[] = [
    {
      name: 'Bronze Classic Frame',
      image: 'assets/frame1.png',
      description: 'A timeless bronze frame inspired by classical European museums, offering warmth and historical elegance.',
      price: '€450',
      layout: 'portrait'
    },
    {
      name: 'Silver Heritage Frame',
      image: 'assets/frame2.png',
      description: 'A refined silver frame with subtle reflections, perfect for modern and impressionist masterpieces.',
      price: '€750',
      layout: 'portrait'
    },
    {
      name: 'Imperial Gold Frame',
      image: 'assets/frame3.png',
      description: 'An opulent gold frame crafted to elevate masterpieces, inspired by royal and museum collections.',
      price: '€1,200',
      layout: 'portrait'
    }
  ];

  isModalOpen = false;
  selectedFrame: FrameProduct | null = null;

  constructor(
    public cartService: CartService,
    public authService: AuthService,
    private notificationService: NotificationService
  ) {}

  handleProductClick(frame: FrameProduct) {
    this.selectedFrame = frame;
    this.isModalOpen = true;
  }

  addToCart(frame: FrameProduct, event: Event) {
    event.stopPropagation();
    
    if (!this.authService.isAuthenticated()) return;

    this.cartService.addToCart({
      name: frame.name,
      artist: 'Luxury Collection',
      variant: 'Museum Edition',
      price: frame.price,
      image: frame.image
    });

    this.notificationService.show(frame.name, 'Luxury Collection');
  }
}
