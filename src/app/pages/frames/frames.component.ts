import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

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
  imports: [CommonModule, RouterLink],
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
}
