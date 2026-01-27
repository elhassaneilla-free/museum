import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductModalComponent } from '../../components/product-modal/product-modal.component';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

interface Painting {
  name: string;
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
      { name: 'Mona Lisa', image: 'assets/leo1.jpg', description: 'The portrait of Lisa Gherardini, a masterpiece of Renaissance art.', price: 'Priceless' },
      { name: 'Vitruvian Man', image: 'assets/leo2.jpg', description: 'Exploring the proportions of the human body and celestial geometry.', price: '€2,500,000' },
      { name: 'Annunciation', image: 'assets/leo3.jpg', description: 'A timeless depiction of the angel Gabriel and the Virgin Mary.', price: '€85,000,000' },
      { name: 'Lady with an Ermine', image: 'assets/leo4.jpg', description: 'A symbolic portrait capturing grace and intense focus.', price: '€95,000,000' }
    ]
  },
  'picasso': {
    name: 'Pablo Picasso',
    layout: 'portrait',
    paintings: [
      { name: 'Guernica', image: 'assets/picasso1.jpg', description: 'An anti-war masterpiece depicting the tragedy of conflict.', price: '€200,000,000' },
      { name: 'The Old Guitarist', image: 'assets/picasso2.jpg', description: 'A poignant study of exhaustion and sorrow from the Blue Period.', price: '€150,000,000' },
      { name: 'Dove of Peace', image: 'assets/picasso3.jpg', description: 'A universal symbol of hope and tranquility.', price: '€110,000,000' },
      { name: 'Portrait of Dora Maar', image: 'assets/picasso4.jpg', description: 'A distortion of reality through the lens of cubism.', price: '€140,000,000' }
    ]
  },
  'van-gogh': {
    name: 'Vincent van Gogh',
    layout: 'landscape',
    paintings: [
      { name: 'The Starry Night', image: 'assets/van1.jpg', description: 'A swirling dream of the night sky over Saint-Rémy.', price: '€350,000,000' },
      { name: 'Irises', image: 'assets/van2.jpg', description: 'Vibrant flowers captured with emotional intensity.', price: '€180,000,000' },
      { name: 'Van Gogh Self-Portrait', image: 'assets/van3.jpg', description: 'An introspective gaze into the artist\'s soul.', price: '€220,000,000' },
      { name: 'The Potato Eaters', image: 'assets/van4.jpg', description: 'A somber depiction of peasant life and labor.', price: '€90,000,000' }
    ]
  },
  'vermeer': {
    name: 'Johannes Vermeer',
    layout: 'portrait',
    paintings: [
      { name: 'Girl with a Pearl Earring', image: 'assets/vermeer1.jpg', description: 'The "Mona Lisa of the North", a study of light and form.', price: '€160,000,000' },
      { name: 'The Art of Painting', image: 'assets/vermeer2.jpg', description: 'An allegorical celebration of the artist\'s craft.', price: '€130,000,000' },
      { name: 'The Milkmaid', image: 'assets/vermeer3.jpg', description: 'A serene moment of domesticity captured in perfect light.', price: '€115,000,000' },
      { name: 'View of Delft', image: 'assets/vermeer4.jpg', description: 'A masterful cityscape shimmering with morning light.', price: '€145,000,000' }
    ]
  },
  'monet': {
    name: 'Claude Monet',
    layout: 'landscape',
    paintings: [
      { name: 'Impression, Sunrise', image: 'assets/mon1.jpg', description: 'The painting that gave birth to the Impressionist movement.', price: '€175,000,000' },
      { name: 'Woman with a Parasol', image: 'assets/mon2.jpg', description: 'A fleeting moment of light and shadow in a summer field.', price: '€125,000,000' },
      { name: 'The Water Lily Pond', image: 'assets/mon3.jpg', description: 'A meditative study of nature at Giverny.', price: '€190,000,000' },
      { name: 'San Giorgio Maggiore at Dusk', image: 'assets/mon4.jpg', description: 'The ethereal light of Venice captured in oil.', price: '€140,000,000' }
    ]
  },
  'hopper': {
    name: 'Edward Hopper',
    layout: 'landscape',
    paintings: [
      { name: 'Nighthawks', image: 'assets/hop1.jpg', description: 'An iconic depiction of urban loneliness and light.', price: '€250,000,000' },
      { name: 'Automat', image: 'assets/hop2.jpg', description: 'A solitary figure in a brightly lit café.', price: '€110,000,000' },
      { name: 'Chop Suey', image: 'assets/hop3.jpg', description: 'Two women in a restaurant, a study of social interaction.', price: '€130,000,000' },
      { name: 'Rooms by the Sea', image: 'assets/hop4.jpg', description: 'The boundary between interior space and the vast ocean.', price: '€120,000,000' }
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
  artistId: string | null = null;
  artist: ArtistData | null = null;
  
  isModalOpen = false;
  selectedPainting: Painting | null = null;

  constructor(
    private route: ActivatedRoute,
    public cartService: CartService,
    public authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.artistId = params.get('id');
      if (this.artistId && ARTISTS_DATA[this.artistId]) {
        this.artist = ARTISTS_DATA[this.artistId];
      }
    });
  }

  handlePaintingClick(painting: Painting) {
    this.selectedPainting = painting;
    this.isModalOpen = true;
  }

  addToCart(painting: Painting, event: Event) {
    event.stopPropagation();
    
    if (!this.authService.isAuthenticated()) return;

    // Default fast-add for collection from list
    this.cartService.addToCart({
      name: painting.name,
      artist: this.artist?.name || 'Unknown Artist',
      variant: 'Museum Original',
      price: painting.price,
      image: painting.image
    });

    this.notificationService.show(painting.name, this.artist?.name);
  }
}
