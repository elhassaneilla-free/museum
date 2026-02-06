import { Component, ElementRef, ViewChild, AfterViewInit, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-victoria-heritage-book',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('fadeInUp', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  template: `
    <section class="relative w-full bg-[#050505] text-white flex flex-col items-center justify-center pt-12 pb-0 overflow-hidden min-h-[800px]">
      
      <!-- Ambient Background Elements -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a1500] via-[#050505] to-[#000000] opacity-80"></div>
      <div class="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      
      <!-- Core Container -->
      <div class="relative z-10 w-full max-w-7xl px-6 flex flex-col items-center -mt-16">
 
        <!-- 3D Book Wrapper -->
        <div class="relative perspective-[2000px] group">
          
          <!-- Book Object -->
          <div #book 
               class="relative w-[320px] h-[480px] md:w-[380px] md:h-[560px] transform-style-3d transition-transform duration-[1.5s] ease-in-out cursor-default shadow-[0_40px_80px_-20px_rgba(0,0,0,1)]"
               [class.hover-float]="!isOpen()">
            
            <!-- BACK COVER (Base) -->
            <div class="absolute inset-0 bg-[#0c0c0c] rounded-r-md border border-[#ffffff]/10 transform translate-z-[-20px]"></div>
 
            <!-- PAGES BLOCK (Thickness) -->
            <div class="absolute right-0 top-1 bottom-1 w-[22px] bg-[#e3dac1] transform rotate-y-90 translate-x-[11px] origin-right shadow-inner bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
 
            <!-- INSIDE CONTENT (Revealed when open) -->
            <div class="absolute inset-0 bg-[#0a0a0a] rounded-r-md flex flex-col items-center justify-center p-8 md:p-12 overflow-hidden backface-hidden transform rotate-y-0 z-10 border-l border-[#ffffff]/10 shadow-[inner_0_0_50px_rgba(0,0,0,0.8)]">
              
              <!-- Inner Page Texture -->
              <div class="absolute inset-0 bg-[#f4ead5] opacity-[0.05] mix-blend-overlay"></div>
              
              <!-- Content Carousel -->
              <div class="relative z-20 w-full h-full flex flex-col items-center text-center transition-opacity duration-500"
                   [class.opacity-100]="isOpen()" 
                   [class.opacity-0]="!isOpen()">
                
                <!-- Navigation Arrows -->
                <button (click)="prevPage()" 
                        class="absolute left-[-50px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-gold/30 text-gold flex items-center justify-center hover:bg-gold/10 hover:border-gold hover:scale-110 transition-all z-50 disabled:opacity-0 disabled:cursor-default shadow-lg" 
                        [disabled]="currentPage() === 0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
                
                <button (click)="nextPage()" 
                        class="absolute right-[-50px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-gold/30 text-gold flex items-center justify-center hover:bg-gold/10 hover:border-gold hover:scale-110 transition-all z-50 shadow-lg">
                  <!-- Show Close icon on last page, else show Next arrow -->
                  <svg *ngIf="currentPage() < pages.length - 1" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  <svg *ngIf="currentPage() === pages.length - 1" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
 
                <!-- Page Content -->
                <div class="flex-1 flex flex-col justify-center items-center space-y-8" [@fadeInUp]="currentPage()">
                  <div class="space-y-3">
                    <p class="font-['Cinzel'] text-[11px] uppercase tracking-[0.5em] text-gold font-bold drop-shadow-sm">Chapter {{romanize(currentPage() + 1)}}</p>
                    <h3 class="font-['Playfair_Display'] text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-br from-[#ffd700] via-[#c6a664] to-[#8a7236] italic drop-shadow-md font-medium leading-tight">
                      {{ pages[currentPage()].title }}
                    </h3>
                    <div class="w-16 h-[2px] bg-gradient-to-r from-transparent via-gold/60 to-transparent mx-auto mt-6 shadow-[0_0_10px_rgba(198,166,100,0.4)]"></div>
                  </div>
                  
                  <div class="prose max-w-[260px] md:max-w-[300px]">
                    <p class="font-['Inter'] text-[14px] md:text-[15px] leading-relaxed text-neutral-200 font-light drop-shadow-sm italic">
                      {{ pages[currentPage()].desc }}
                    </p>
                  </div>
                  
                  <div class="pt-6">
                     <span class="font-['Allura'] text-3xl text-gold/60 drop-shadow-sm">Victoria</span>
                  </div>
                </div>
 
                <!-- Page Indicators -->
                <div class="flex space-x-3 mt-auto pb-6">
                  <div *ngFor="let p of pages; let i = index" 
                       class="w-1.5 h-1.5 rounded-full transition-all duration-300 shadow-sm"
                       [class.bg-gold]="i === currentPage()"
                       [class.w-6]="i === currentPage()"
                       [class.bg-white/10]="i !== currentPage()"></div>
                </div>
 
              </div>
            </div>
 
            <!-- FRONT COVER (Rotates open) -->
            <div #frontCover 
                 class="absolute inset-0 bg-[#080808] rounded-r-md origin-left transform-style-3d z-30 flex flex-col items-center justify-center border-r-2 border-[#1a1a1a] shadow-[10px_0_30px_rgba(0,0,0,0.8)] transition-all duration-1000 group-hover:brightness-125 hover:shadow-2xl"
                 style="background-image: url('https://www.transparenttextures.com/patterns/leather.png');">
               
               <!-- Leather Grain Overlay -->
               <div class="absolute inset-0 bg-black/40 pointer-events-none"></div>
               
               <!-- Gold frame inlay -->
               <div class="absolute inset-6 border-2 border-[#c6a664]/40 rounded-sm opacity-90 shadow-[inset_0_0_30px_rgba(0,0,0,0.9)]"></div>
 
               <!-- Cover Text -->
               <div class="relative z-10 text-center space-y-8 transform translate-z-[2px]">
                  <h1 class="font-['Cinzel'] text-5xl md:text-6xl text-[#c6a664] tracking-widest drop-shadow-[0_4px_8px_rgba(0,0,0,1)] bg-gradient-to-b from-[#f5ecd1] to-[#8a7236] bg-clip-text text-transparent font-bold">
                    VICTORIA
                  </h1>
                  <p class="font-['Inter'] text-[11px] uppercase tracking-[0.6em] text-[#c6a664] font-bold drop-shadow-md">Museum Heritage Collection</p>
                  
                  <!-- Emblem -->
                  <div class="pt-10">
                    <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="text-gold mx-auto opacity-80 drop-shadow-[0_0_10px_rgba(198,166,100,0.5)]">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  </div>
               </div>
 
               <!-- Spine shadow -->
               <div class="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-black to-transparent pointer-events-none opacity-90"></div>
            </div>
 
          </div>
 
          <!-- PLAY BUTTON (Floats below) -->
          <div class="absolute -bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-6 transition-all duration-700"
               [class.opacity-0]="isOpen()" 
               [class.pointer-events-none]="isOpen()">
            
            <button (click)="openBook()" 
                    class="group relative w-20 h-20 rounded-full flex items-center justify-center transition-transform duration-500 hover:scale-110">
              <!-- Glow Ring -->
              <div class="absolute inset-0 rounded-full border-2 border-[#c6a664]/40 group-hover:border-[#c6a664] group-hover:shadow-[0_0_30px_rgba(198,166,100,0.6)] transition-all duration-500"></div>
              <!-- Inner circle -->
              <div class="absolute inset-2 bg-[#c6a664]/10 rounded-full backdrop-blur-md group-hover:bg-[#c6a664]/20 transition-colors"></div>
              <!-- Play Icon -->
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="text-[#c6a664] ml-1 opacity-90 group-hover:opacity-100 transition-opacity">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
            
            <span class="font-['Cinzel'] text-[12px] uppercase tracking-[0.4em] text-gold font-bold animate-pulse drop-shadow-md">Open Archive</span>
          </div>
 
          <!-- CLOSE BUTTON (Visible only when open) -->
          <div class="absolute -bottom-32 left-1/2 -translate-x-1/2 transition-all duration-700 delay-300"
               [class.opacity-0]="!isOpen()" 
               [class.pointer-events-none]="!isOpen()">
             <button (click)="closeBook()" class="font-['Cinzel'] text-[11px] uppercase tracking-[0.4em] text-neutral-400 hover:text-gold transition-all border-b border-transparent hover:border-gold font-bold drop-shadow-sm">
               Close Volume
             </button>
          </div>
 
        </div>
 
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; position: relative; z-index: 10; }
    .transform-style-3d { transform-style: preserve-3d; }
    .backface-hidden { backface-visibility: hidden; }
    .perspective-2000 { perspective: 2000px; }
    
    .hover-float {
      animation: float 6s ease-in-out infinite;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0) rotateX(0) rotateY(0); }
      50% { transform: translateY(-15px) rotateX(2deg) rotateY(-2deg); }
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.6s ease-out forwards;
    }
  `]
})
export class VictoriaHeritageBookComponent implements AfterViewInit {
  @ViewChild('frontCover') frontCover!: ElementRef;
  @ViewChild('book') book!: ElementRef;

  isOpen = signal(false);
  currentPage = signal(0);

  pages = [
    {
      title: 'Our Origins',
      desc: 'Founded on the principle that art is the soul of civilization, Victoria serves as a guardian of digital heritage, preserving the finest works of human history for eternity.'
    },
    {
      title: 'Preservation',
      desc: 'Through meticulous digital archiving and physical conservation, we ensure that every brushstroke, texture, and emotion is captured in immaculate high-definition.'
    },
    {
      title: 'The Collection',
      desc: 'Home to masterpieces by Da Vinci, Monet, and Vermeer. Our curated halls invite you to walk amongst giants and experience the weight of history.'
    }
  ];

  ngAfterViewInit() {
    // Initial subtle parallax
    gsap.to(this.book.nativeElement, {
      scrollTrigger: {
        trigger: this.book.nativeElement,
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      },
      y: -50,
      ease: 'none'
    });
  }

  openBook() {
    this.isOpen.set(true);
    
    const timeline = gsap.timeline();
    
    // Rotate book to center - SHIFT RIGHT to compensate for open cover
    timeline.to(this.book.nativeElement, {
      rotateY: -5,
      rotateX: 5,
      x: 100, // Shift right to visual center
      scale: 1.05,
      duration: 1,
      ease: 'power3.inOut'
    });

    // Open Cover
    timeline.to(this.frontCover.nativeElement, {
      rotateY: -170, // Open wide
      duration: 1.5,
      ease: 'power2.inOut'
    }, "-=0.8");
  }

  closeBook() {
    const timeline = gsap.timeline({
      onComplete: () => this.isOpen.set(false)
    });

    // Close Cover
    timeline.to(this.frontCover.nativeElement, {
      rotateY: 0,
      duration: 1.2,
      ease: 'power2.inOut'
    });

    // Reset book position
    timeline.to(this.book.nativeElement, {
      rotateY: 0,
      rotateX: 0,
      x: 0,
      scale: 1,
      duration: 1,
      ease: 'power3.inOut'
    }, "-=1");
  }

  nextPage() {
    if (this.currentPage() < this.pages.length - 1) {
      this.currentPage.update(p => p + 1);
    } else {
      // Close book if on last page
      this.closeBook();
    }
  }

  prevPage() {
    if (this.currentPage() > 0) {
      this.currentPage.update(p => p - 1);
    }
  }

  romanize(num: number): string {
    const roman = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
    let str = '', i;
    for ( i in roman ) {
      // @ts-ignore
      while ( num >= roman[i] ) {
        str += i;
        // @ts-ignore
        num -= roman[i];
      }
    }
    return str;
  }
}
