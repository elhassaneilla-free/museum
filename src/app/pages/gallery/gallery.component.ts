import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';

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
export class GalleryComponent implements OnInit {
  artists: any[] = [];

  private staticArtistImages: Record<string, string> = {
    'Leonardo da Vinci': 'assets/leo0.png',
    'Pablo Picasso': 'assets/pablo0.png',
    'Vincent van Gogh': 'assets/van0.png',
    'Johannes Vermeer': 'assets/joh0.png',
    'Claude Monet': 'assets/clau0.png',
    'Edward Hopper': 'assets/edwa0.png'
  };

  private artistRoutes: Record<string, string> = {
    'Leonardo da Vinci': 'leonardo',
    'Pablo Picasso': 'picasso',
    'Vincent van Gogh': 'van-gogh',
    'Johannes Vermeer': 'vermeer',
    'Claude Monet': 'monet',
    'Edward Hopper': 'hopper'
  };

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getPaintings().subscribe(paintings => {
      const artistMap = new Map();
      
      paintings.forEach(p => {
        if (p.category === 'Frames') return;
        if (!artistMap.has(p.artist)) {
          artistMap.set(p.artist, {
            name: p.artist,
            image: this.staticArtistImages[p.artist] || p.image,
            route: '/artist/' + (this.artistRoutes[p.artist] || p.artist.toLowerCase().replace(/\s+/g, '-'))
          });
        }
      });

      this.artists = Array.from(artistMap.values());
      
      // Always add Frames at the end
      this.artists.push({ 
        name: 'Luxury Frames Collection', 
        image: 'assets/frame0.png', 
        route: '/frames' 
      });
    });
  }
}
