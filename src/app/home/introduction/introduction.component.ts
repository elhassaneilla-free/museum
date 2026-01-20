import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-introduction',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="relative w-full bg-[#0a0a0a] text-neutral-200 py-24 lg:py-32 overflow-hidden">
      <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <!-- Image -->
          <div class="relative w-full h-[500px] lg:h-[700px] bg-neutral-900 overflow-hidden shadow-2xl">
              <img 
                src="/assets/hero2.png" 
                alt="Classical marble statue in dramatic lighting" 
                class="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-[2000ms] ease-out"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>

          <!-- Text -->
          <div class="space-y-10 lg:pl-10">
            <h2 class="font-['Playfair_Display'] text-4xl sm:text-5xl lg:text-6xl text-[#c6a664] leading-tight">
              A Virtual Sanctuary <br class="hidden lg:block"/> for Art and Heritage
            </h2>
            <p class="font-['Inter'] text-lg sm:text-xl text-neutral-400 leading-relaxed font-light max-w-lg">
              VICTORIA is a digital homage to the golden ages of creativity — where masterworks are not only preserved, but experienced, curated, and admired as timeless treasures.
            </p>
            
            <div class="h-px w-24 bg-[#c6a664] opacity-30"></div>
          </div>

        </div>
      </div>
    </section>
  `,
  styles: []
})
export class IntroductionComponent {}
