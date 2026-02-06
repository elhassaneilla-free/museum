import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-introduction',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="relative w-full bg-[#080808] text-neutral-100 pt-32 lg:pt-48 pb-16 lg:pb-24 overflow-hidden font-sans">
      <!-- Artistic Texture Overlay -->
      <div class="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay grayscale brightness-125" 
           style="background-image: url('https://grainy-gradients.vercel.app/noise.svg');"></div>

      <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          
          <!-- Image Section -->
          <div class="relative group">
            <div class="relative w-full h-[500px] lg:h-[750px] bg-[#0a0a0a] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)] p-4 border border-[#c6a664]/20">
                <div class="absolute inset-0 border border-[#c6a664]/10 m-2 pointer-events-none z-20"></div>
                <img 
                  src="/assets/hero2.png" 
                  alt="Classical marble statue in dramatic lighting" 
                  class="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[3000ms] ease-out grayscale-[0.2] group-hover:grayscale-0"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10"></div>
                
                <!-- Caption Overlay -->
                <div class="absolute bottom-10 left-10 z-20 overflow-hidden">
                  <span class="font-['Cinzel'] text-[11px] text-[#c6a664] tracking-[0.4em] uppercase block transform translate-y-full group-hover:translate-y-0 transition-transform duration-1000 font-bold drop-shadow-md">Exhibition Record: Vol. 1</span>
                </div>
            </div>
            <!-- Decorative Back-frame -->
            <div class="absolute -top-6 -right-6 w-32 h-32 border-t-2 border-r-2 border-[#c6a664]/20 -z-10 group-hover:top-0 group-hover:right-0 transition-all duration-1000"></div>
            <div class="absolute -bottom-6 -left-6 w-32 h-32 border-b-2 border-l-2 border-[#c6a664]/20 -z-10 group-hover:bottom-0 group-hover:left-0 transition-all duration-1000"></div>
          </div>

          <!-- Text Section -->
          <div class="space-y-12">
            <div class="space-y-4">
              <span class="font-['Cinzel'] text-[11px] text-[#c6a664] tracking-[0.8em] uppercase block font-bold drop-shadow-sm">Our Philosophy</span>
              <h2 class="font-['Playfair_Display'] text-5xl sm:text-6xl lg:text-7xl text-[#c6a664] leading-[1.1] font-light italic drop-shadow-lg">
                A Digital <br class="hidden lg:block"/> Sanctuary 
              </h2>
              <div class="w-24 h-px bg-gradient-to-r from-[#c6a664] to-transparent mt-4 opacity-60 shadow-[0_0_8px_rgba(198,166,100,0.4)]"></div>
            </div>

            <p class="font-['Inter'] text-lg sm:text-xl text-neutral-400 leading-relaxed font-light max-w-lg drop-shadow-sm">
              VICTORIA is more than a platform; it is a meticulous digital tribute to the golden ages of creativity. We preserve masterworks as 
              <span class="text-white italic font-medium">timeless treasures</span>, curated with institutional precision and experienced with modern elegance.
            </p>
            
            <div class="grid grid-cols-2 gap-10 pt-8 border-t border-[#c6a664]/10">
              <div class="space-y-2">
                <span class="font-['Cinzel'] text-2xl text-[#c6a664] tracking-widest font-bold drop-shadow-md">2.4k+</span>
                <span class="text-[10px] text-neutral-400 uppercase tracking-[0.3em] font-bold block">Archives</span>
              </div>
              <div class="space-y-2">
                <span class="font-['Cinzel'] text-2xl text-[#c6a664] tracking-widest font-bold drop-shadow-md">1892</span>
                <span class="text-[10px] text-neutral-400 uppercase tracking-[0.3em] font-bold block">Heritage Base</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  `,
  styles: []
})
export class IntroductionComponent {}
