import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Artist {
  name: string;
  image: string;
  route: string;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gallery.component.html',
  styles: []
})
export class GalleryComponent {
  artists: Artist[] = [
    { name: 'Leonardo da Vinci', image: 'assets/leo0.png', route: '/artist/leonardo' },
    { name: 'Pablo Picasso', image: 'assets/pablo0.png', route: '/artist/picasso' },
    { name: 'Vincent van Gogh', image: 'assets/van0.png', route: '/artist/van-gogh' },
    { name: 'Johannes Vermeer', image: 'assets/joh0.png', route: '/artist/vermeer' },
    { name: 'Claude Monet', image: 'assets/clau0.png', route: '/artist/monet' },
    { name: 'Edward Hopper', image: 'assets/edwa0.png', route: '/artist/hopper' }
  ];
}
