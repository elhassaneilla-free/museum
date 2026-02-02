import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ProductModalComponent } from '../../components/product-modal/product-modal.component';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-frames',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductModalComponent],
  templateUrl: './frames.component.html',
  styles: []
})
export class FramesComponent implements OnInit {
  frames: any[] = [];
  isModalOpen = false;
  selectedFrame: any | null = null;

  constructor(
    public cartService: CartService,
    public authService: AuthService,
    private notificationService: NotificationService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.dataService.getPaintings().subscribe(data => {
      this.frames = data.filter(p => p.category === 'Frames');
    });
  }

  handleProductClick(frame: any) {
    this.selectedFrame = frame;
    this.isModalOpen = true;
  }

  addToCart(frame: any, event: Event) {
    event.stopPropagation();
    
    if (!this.authService.isAuthenticated()) return;

    this.cartService.addToCart({
      name: frame.title,
      artist: frame.artist,
      variant: 'Museum Edition',
      price: frame.price,
      image: frame.image
    });

    this.notificationService.show(frame.title, frame.artist);
  }
}
