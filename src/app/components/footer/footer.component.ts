import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="w-full bg-[#050505] text-neutral-400 py-24 border-t border-neutral-900/50">
      <div class="max-w-5xl mx-auto px-6 text-center space-y-16">
        <!-- Brand -->
        <div class="space-y-8 flex flex-col items-center">
          <a
            routerLink="/"
            class="group flex flex-col items-center space-y-5 transition-all duration-500"
          >
            <img 
              src="/assets/logo.png" 
              alt="VICTORIA Logo" 
              class="h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(198,166,100,0.15)] group-hover:drop-shadow-[0_0_20px_rgba(198,166,100,0.3)] transition-all duration-500" 
            />
            <span
              class="font-['Cinzel'] font-black text-3xl sm:text-4xl uppercase tracking-[0.4em] leading-none bg-gradient-to-b from-[#f3e3c3] via-[#c6a664] to-[#8a6d33] bg-clip-text text-transparent drop-shadow-sm select-none"
              >VICTORIA</span
            >
          </a>
          <p class="font-['Inter'] text-base font-light tracking-[0.1em] text-neutral-500 italic max-w-sm">
            Preserving timeless art through digital elegance.
          </p>
        </div>

        <!-- Navigation -->
        <nav>
          <ul class="flex justify-center items-center flex-wrap gap-8 sm:gap-12">
            <li>
              <a
                routerLink="/"
                class="cursor-pointer font-['Inter'] text-xs sm:text-sm uppercase tracking-[0.15em] hover:text-[#c6a664] transition-colors duration-300"
                >Home</a
              >
            </li>
            <li>
              <a
                routerLink="/about"
                class="cursor-pointer font-['Inter'] text-xs sm:text-sm uppercase tracking-[0.15em] hover:text-[#c6a664] transition-colors duration-300"
                >About</a
              >
            </li>
            <li>
              <a
                routerLink="/gallery"
                class="cursor-pointer font-['Inter'] text-xs sm:text-sm uppercase tracking-[0.15em] hover:text-[#c6a664] transition-colors duration-300"
                >Gallery</a
              >
            </li>
          </ul>
        </nav>

        <!-- Copyright -->
        <div class="pt-10 border-t border-neutral-900/50">
          <p
            class="font-['Inter'] text-[10px] sm:text-xs text-neutral-700 uppercase tracking-widest"
          >
            &copy; 2026 VICTORIA. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: [],
})
export class FooterComponent {}
