import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductModalComponent } from '../../components/product-modal/product-modal.component';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { DataService } from '../../services/data.service';

interface Painting {
  title: string;
  image: string;
  description: string;
  price: string;
}

interface ArtistData {
  name: string;
  layout: 'portrait' | 'landscape';
  paintings: Painting[];
}

const ARTISTS_DATA: Record<string, ArtistData> = {
  'leonardo': {
    name: 'Leonardo da Vinci',
    layout: 'portrait',
    paintings: [
      { title: 'Mona Lisa', image: 'assets/leo1.jpg', description: 'The portrait of Lisa Gherardini, a masterpiece of Renaissance art.', price: '$1,500' },
      { title: 'Vitruvian Man', image: 'assets/leo2.jpg', description: 'Exploring the proportions of the human body and celestial geometry.', price: '$1,200' },
      { title: 'Annunciation', image: 'assets/leo3.jpg', description: 'A timeless depiction of the angel Gabriel and the Virgin Mary.', price: '$950' },
      { title: 'Lady with an Ermine', image: 'assets/leo4.jpg', description: 'A symbolic portrait capturing grace and intense focus.', price: '$1,100' }
    ]
  },
  'picasso': {
    name: 'Pablo Picasso',
    layout: 'portrait',
    paintings: [
      { title: 'Guernica', image: 'assets/picasso1.jpg', description: 'An anti-war masterpiece depicting the tragedy of conflict.', price: '$1,400' },
      { title: 'The Old Guitarist', image: 'assets/picasso2.jpg', description: 'A poignant study of exhaustion and sorrow from the Blue Period.', price: '$850' },
      { title: 'Dove of Peace', image: 'assets/picasso3.jpg', description: 'A universal symbol of hope and tranquility.', price: '$600' },
      { title: 'Portrait of Dora Maar', image: 'assets/picasso4.jpg', description: 'A distortion of reality through the lens of cubism.', price: '$1,250' }
    ]
  },
  'van-gogh': {
    name: 'Vincent van Gogh',
    layout: 'landscape',
    paintings: [
      { title: 'The Starry Night', image: 'assets/van1.jpg', description: 'A swirling dream of the night sky over Saint-Rémy.', price: '$1,450' },
      { title: 'Irises', image: 'assets/van2.jpg', description: 'Vibrant flowers captured with emotional intensity.', price: '$1,100' },
      { title: 'Van Gogh Self-Portrait', image: 'assets/van3.jpg', description: 'An introspective gaze into the artist\'s soul.', price: '$980' },
      { title: 'The Potato Eaters', image: 'assets/van4.jpg', description: 'A somber depiction of peasant life and labor.', price: '$750' }
    ]
  },
  'vermeer': {
    name: 'Johannes Vermeer',
    layout: 'portrait',
    paintings: [
      { title: 'Girl with a Pearl Earring', image: 'assets/vermeer1.jpg', description: 'The "Mona Lisa of the North", a study of light and form.', price: '$1,350' },
      { title: 'The Art of Painting', image: 'assets/vermeer2.jpg', description: 'An allegorical celebration of the artist\'s craft.', price: '$1,150' },
      { title: 'The Milkmaid', image: 'assets/vermeer3.jpg', description: 'A serene moment of domesticity captured in perfect light.', price: '$890' },
      { title: 'View of Delft', image: 'assets/vermeer4.jpg', description: 'A masterful cityscape shimmering with morning light.', price: '$1,050' }
    ]
  },
  'monet': {
    name: 'Claude Monet',
    layout: 'landscape',
    paintings: [
      { title: 'Impression, Sunrise', image: 'assets/mon1.jpg', description: 'The painting that gave birth to the Impressionist movement.', price: '$1,300' },
      { title: 'Woman with a Parasol', image: 'assets/mon2.jpg', description: 'A fleeting moment of light and shadow in a summer field.', price: '$920' },
      { title: 'The Water Lily Pond', image: 'assets/mon3.jpg', description: 'A meditative study of nature at Giverny.', price: '$1,400' },
      { title: 'San Giorgio Maggiore at Dusk', image: 'assets/mon4.jpg', description: 'The ethereal light of Venice captured in oil.', price: '$1,180' }
    ]
  },
  'hopper': {
    name: 'Edward Hopper',
    layout: 'landscape',
    paintings: [
      { title: 'Nighthawks', image: 'assets/hop1.jpg', description: 'An iconic depiction of urban loneliness and light.', price: '$1,250' },
      { title: 'Automat', image: 'assets/hop2.jpg', description: 'A solitary figure in a brightly lit café.', price: '$880' },
      { title: 'Chop Suey', image: 'assets/hop3.jpg', description: 'Two women in a restaurant, a study of social interaction.', price: '$1,000' },
      { title: 'Rooms by the Sea', image: 'assets/hop4.jpg', description: 'The boundary between interior space and the vast ocean.', price: '$940' }
    ]
  }
};


@Component({
  selector: 'app-artist-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductModalComponent],
  templateUrl: './artist-page.component.html',
  styles: []
})
export class ArtistPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);
  public cartService = inject(CartService);
  public authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  artistId = signal<string | null>(null);
  artist = computed(() => {
    const id = this.artistId();
    if (!id) return null;
    const meta = ARTISTS_DATA[id];
    return meta || { name: id, layout: 'portrait' };
  });

  paintings = computed(() => {
    const currentArtist = this.artist();
    if (!currentArtist) return [];
    
    return this.dataService.paintings().filter((p: any) => 
      p.artist.toLowerCase().includes(currentArtist.name.toLowerCase()) ||
      currentArtist.name.toLowerCase().includes(p.artist.toLowerCase())
    );
  });
  
  isModalOpen = false;
  selectedPainting: any | null = null;

  constructor() {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.artistId.set(params.get('id'));
    });
    this.dataService.getPaintings().subscribe();
  }

  handlePaintingClick(painting: Painting) {
    this.selectedPainting = painting;
    this.isModalOpen = true;
  }

  addToCart(painting: Painting, event: Event) {
    event.stopPropagation();
    
    if (!this.authService.isAuthenticated()) return;

    const currentArtist = this.artist();

    // Default fast-add for collection from list
    this.cartService.addToCart({
      name: painting.title,
      artist: currentArtist?.name || 'Unknown Artist',
      variant: 'Museum Original',
      price: painting.price,
      image: painting.image
    });

    this.notificationService.show(painting.title, currentArtist?.name);
  }
}
