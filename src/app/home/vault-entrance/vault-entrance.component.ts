import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-vault-entrance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section #entranceSection class="relative w-full h-[120vh] bg-[#020202] overflow-hidden flex flex-col items-center justify-start">
      
      <!-- Ambient Background Glow -->
      <div class="absolute inset-x-0 top-0 h-screen bg-[radial-gradient(circle_at_50%_20%,rgba(198,166,100,0.15)_0%,transparent_70%)] pointer-events-none"></div>
      
      <!-- Sticky Container -->
      <div class="sticky top-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden">
        
        <!-- Perspective Corridor Wrapper -->
        <div #perspectiveWrapper class="absolute inset-0 flex items-center justify-center pointer-events-none" style="perspective: 2000px; perspective-origin: 50% 50%;">
          
          <!-- Moving Light Rays -->
          <div #lightRays class="absolute inset-0 opacity-30 z-0">
            <div class="absolute top-[-50%] left-[25%] w-[1px] h-[200%] bg-gradient-to-b from-transparent via-[#c6a664]/60 to-transparent rotate-[20deg]"></div>
            <div class="absolute top-[-50%] left-[75%] w-[1px] h-[200%] bg-gradient-to-b from-transparent via-[#c6a664]/60 to-transparent rotate-[30deg]"></div>
          </div>

          <!-- Deep Space Frames -->
          <div *ngFor="let i of [1,2,3,4]" #hallFrame 
               class="absolute hallway-frame border border-[#c6a664]/20 shadow-[0_0_100px_rgba(198,166,100,0.08)] transform-gpu opacity-0"
               [ngStyle]="{'width': (85 - i*15) + '%', 'height': (85 - i*15) + '%'}"
               style="border-style: double; border-width: 1px;">
          </div>
          
          <!-- Floating Gold Particles -->
          <div #particleContainer class="absolute inset-0 z-10">
            <div *ngFor="let p of particles" 
                 class="absolute w-1 h-1 bg-[#c6a664] rounded-full blur-[1px] opacity-40 transform-gpu"
                 [ngStyle]="{'left': p.x + '%', 'top': p.y + '%'}"></div>
          </div>
        </div>

        <!-- THE ROYAL ARCHIVE BOOK ZONE -->
        <div #bookWrapper class="relative z-50 flex flex-col items-center mt-[-5vh]">
          
          <!-- Ancient Book Container -->
          <div #bookContainer 
               class="book relative w-[260px] h-[380px] md:w-[300px] md:h-[440px] transform-style-3d transition-all duration-1000">
            
            <!-- Back Cover -->
            <div class="book-cover back absolute inset-0 bg-[#050505] border border-gold/30 shadow-2xl rounded-sm"></div>
            
            <!-- Inner Pages (Framer) -->
            <div class="book-pages absolute inset-[2px] bg-[#fdfaf1] rounded-sm flex flex-col justify-center px-8 text-[#322319] opacity-0 transition-opacity duration-500"
                 [class.opacity-100]="isBookOpen()">
              
              <!-- Carousel Pages -->
              <div class="relative w-full h-full flex flex-col justify-center animate-in fade-in zoom-in duration-1000">
                <div class="text-center space-y-5">
                   <div class="font-['Cinzel'] text-[9px] text-[#6d4f06] tracking-[0.4em] uppercase font-bold">Folio • 0{{ currentPage() + 1 }}</div>
                   <h4 class="font-['Playfair_Display'] text-2xl md:text-3xl italic text-[#322319] font-medium drop-shadow-sm">{{ pages[currentPage()].title }}</h4>
                   <div class="w-10 h-px bg-[#6d4f06]/30 mx-auto"></div>
                   <p class="font-['Inter'] text-[11px] md:text-[12px] leading-relaxed text-[#322319] italic font-medium opacity-90">{{ pages[currentPage()].content }}</p>
                </div>

                <!-- Page Dots -->
                <div class="absolute bottom-6 left-0 right-0 flex justify-center space-x-1.5 pt-4">
                  <div *ngFor="let dot of [0,1,2]" class="w-1.5 h-1.5 rounded-full bg-[#6d4f06]/20 transition-all duration-300"
                       [class.bg-[#6d4f06]]="currentPage() === dot"
                       [class.scale-125]="currentPage() === dot"></div>
                </div>

                <!-- Page Nav buttons -->
                <div class="absolute inset-x-[-15px] top-1/2 -translate-y-1/2 flex justify-between">
                  <button (click)="prevPage()" class="w-8 h-8 flex items-center justify-center rounded-full border border-[#6d4f06]/30 hover:bg-[#6d4f06]/10 text-[#6d4f06] transition-all"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
                  <button (click)="nextPage()" class="w-8 h-8 flex items-center justify-center rounded-full border border-[#6d4f06]/30 hover:bg-[#6d4f06]/10 text-[#6d4f06] transition-all"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
                </div>
              </div>
            </div>

            <!-- Front Cover -->
            <div #frontCover class="book-cover front absolute inset-0 bg-[#0a0a0a] border-2 border-gold/60 shadow-2xl origin-left rounded-sm transform-gpu flex flex-col items-center justify-center p-8 z-10 transition-shadow duration-1000 group">
              <div class="absolute inset-3 border border-gold/20 group-hover:border-gold/40 transition-colors pointer-events-none"></div>
              
              <div class="text-center space-y-6 relative pointer-events-none">
                <span class="font-['Cinzel'] text-[10px] text-gold tracking-[0.8em] uppercase font-bold drop-shadow-sm">Institutional</span>
                <div class="w-12 h-px bg-gold/40 mx-auto"></div>
                <h3 class="font-['Playfair_Display'] text-5xl text-gold italic leading-tight drop-shadow-[0_0_30px_rgba(198,166,100,0.5)] font-medium">Archive <br/> Vol. I</h3>
                <div class="pt-10 opacity-60">
                  <svg width="50" height="50" viewBox="0 0 100 100" class="mx-auto text-gold">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="0.8" stroke-dasharray="1 3"/>
                    <text x="50" y="58" font-family="Cinzel" font-size="32" fill="currentColor" text-anchor="middle" font-weight="bold">V</text>
                  </svg>
                </div>
              </div>

              <!-- Spine detail -->
              <div class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black via-gold/10 to-transparent"></div>
            </div>
          </div>

          <!-- Play Button (Under the Book) -->
          <div class="mt-12 flex flex-col items-center space-y-6">
             <button 
                *ngIf="!isBookOpen()"
                (click)="openBook()"
                class="group w-20 h-20 rounded-full border-2 border-gold/60 flex items-center justify-center bg-black/60 hover:scale-110 hover:border-gold hover:shadow-[0_0_40px_rgba(198,166,100,0.6)] transition-all duration-700 relative"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="text-gold ml-1">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <div class="absolute inset-[-4px] border border-gold/40 rounded-full animate-pulse opacity-40"></div>
              </button>

              <button 
                *ngIf="isBookOpen()"
                (click)="closeBook()"
                class="font-['Cinzel'] text-[11px] text-gold/80 uppercase tracking-[0.8em] hover:text-gold transition-colors font-bold drop-shadow-sm"
              >
                Seal Folio
              </button>

              <span *ngIf="!isBookOpen()" class="font-['Cinzel'] text-[11px] text-gold/80 uppercase tracking-[1em] opacity-0 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-500 font-bold drop-shadow-md">
                Unlock Archive
              </span>
          </div>

        </div>

        <!-- Background Glow Center -->
        <div #coreGlow class="absolute w-64 h-64 bg-gold/20 rounded-full blur-[180px] pointer-events-none"></div>

      </div>

      <!-- Fine Texture -->
      <div class="absolute inset-0 pointer-events-none opacity-[0.06] grayscale brightness-150 mix-blend-screen" 
           style="background-image: url('https://grainy-gradients.vercel.app/noise.svg');"></div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .transform-style-3d { transform-style: preserve-3d; }
    .origin-left { transform-origin: left center; }
    .book-cover { backface-visibility: hidden; }
    .book-cover.back { transform: translateZ(-1px); }
    
    .hallway-frame { position: relative; overflow: hidden; }
    .hallway-frame::after {
      content: '';
      position: absolute;
      top: -100%; left: -100%; width: 300%; height: 300%;
      background: linear-gradient(45deg, transparent 45%, rgba(198,166,100,0.08) 50%, transparent 55%);
      animation: sheen 12s infinite linear;
    }
    @keyframes sheen {
      from { transform: translate(-50%, -50%) rotate(0deg); }
      to { transform: translate(50%, 50%) rotate(360deg); }
    }
  `]
})
export class VaultEntranceComponent implements AfterViewInit, OnDestroy {
  @ViewChild('entranceSection') entranceSection!: ElementRef;
  @ViewChild('perspectiveWrapper') perspectiveWrapper!: ElementRef;
  @ViewChild('bookContainer') bookContainer!: ElementRef;
  @ViewChild('frontCover') frontCover!: ElementRef;
  @ViewChild('coreGlow') coreGlow!: ElementRef;
  @ViewChild('lightRays') lightRays!: ElementRef;
  @ViewChild('particleContainer') particleContainer!: ElementRef;

  isBookOpen = signal(false);
  currentPage = signal(0);

  pages = [
    { 
      title: 'Eternal Art', 
      content: 'The Golden Era of Expression. From the heavy brushstrokes of the Renaissance to the fleeting light of Impressionism, these works redefined human sight through the centuries.' 
    },
    { 
      title: 'The Masters', 
      content: 'Masters of Light and Shadow. Visionaries like Da Vinci, Van Gogh, and Vermeer didn\'t just paint; they captured the invisible soul of existence on canvas.' 
    },
    { 
      title: 'Sanctuary', 
      content: 'The Victoria Institution. Our mission is to safeguard these eternal treasures, ensuring that the dialogue between the past and future never fades into the void.' 
    }
  ];

  particles = Array.from({ length: 30 }).map(() => ({
    x: Math.random() * 100, y: Math.random() * 100
  }));

  private scrollTriggerInstance: any;

  ngAfterViewInit() {
    this.initAnimations();
    this.initHoverEffect();
  }

  ngOnDestroy() {
    if (this.scrollTriggerInstance) {
      this.scrollTriggerInstance.kill();
    }
  }

  openBook() {
    this.isBookOpen.set(true);
    gsap.to(this.frontCover.nativeElement, {
      rotateY: -160,
      duration: 1.8,
      ease: 'power3.inOut'
    });
    // Shift the book to look better while open
    gsap.to(this.bookContainer.nativeElement, {
      x: 100,
      rotateY: -10,
      duration: 1.8,
      ease: 'power3.inOut'
    });
  }

  closeBook() {
    gsap.to(this.frontCover.nativeElement, {
      rotateY: 0,
      duration: 1.5,
      ease: 'power3.inOut',
      onComplete: () => this.isBookOpen.set(false)
    });
    gsap.to(this.bookContainer.nativeElement, {
      x: 0,
      rotateY: 0,
      duration: 1.5,
      ease: 'power3.inOut'
    });
  }

  prevPage() {
    if (this.currentPage() > 0) this.currentPage.update(p => p - 1);
  }

  nextPage() {
    if (this.currentPage() < this.pages.length - 1) this.currentPage.update(p => p + 1);
  }

  private initAnimations() {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.entranceSection.nativeElement,
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: 1.5,
        invalidateOnRefresh: true
      }
    });

    const frames = this.entranceSection.nativeElement.querySelectorAll('.hallway-frame');
    frames.forEach((f: any, i: number) => {
      tl.fromTo(f, 
        { z: -5000 - (i * 1200), opacity: 0 }, 
        { z: 1200, opacity: 0.1, ease: 'none' }, 
        i * 0.15
      );
    });

    tl.fromTo(this.bookContainer.nativeElement, 
      { z: -8000, opacity: 0, scale: 0.3 }, 
      { z: 0, opacity: 1, scale: 1, ease: 'power2.out' }, 0.4
    );

    tl.to(this.coreGlow.nativeElement, { scale: 5, opacity: 0.15, ease: 'power2.out' }, 0.5);

    // Idle Particles drift
    const pEls = this.particleContainer.nativeElement.children;
    Array.from(pEls).forEach((p: any) => {
      gsap.to(p, {
        y: 'random(-80, 80)',
        x: 'random(-80, 80)',
        duration: 'random(4, 10)',
        repeat: -1, yoyo: true, ease: 'sine.inOut'
      });
    });

    this.scrollTriggerInstance = tl.scrollTrigger;
  }

  private initHoverEffect() {
    window.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = this.entranceSection.nativeElement.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(this.perspectiveWrapper.nativeElement, {
          rotateY: x * 10,
          rotateX: -y * 10,
          duration: 2.5,
          ease: 'power2.out'
        });
      }
    });
  }
}
