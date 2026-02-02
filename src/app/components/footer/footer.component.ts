import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="relative w-full bg-[#050505] text-neutral-400 py-32 border-t border-[#c6a664]/10 overflow-hidden font-sans">
      <!-- Artistic Texture Overlay -->
      <div class="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay grayscale brightness-125" 
           style="background-image: url('https://grainy-gradients.vercel.app/noise.svg');"></div>

      <div class="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-20">
          
          <!-- Brand Column -->
          <div class="lg:col-span-2 space-y-12">
            <a routerLink="/" class="group inline-block">
              <div class="flex items-center space-x-6">
                <img src="/assets/logo.png" alt="VICTORIA" class="h-16 w-auto opacity-80 group-hover:opacity-100 transition-opacity">
                <div class="h-12 w-px bg-[#c6a664]/20 hidden sm:block"></div>
                <span class="font-['Cinzel'] text-3xl text-[#c6a664] tracking-[0.4em] uppercase font-bold">Victoria</span>
              </div>
              <p class="font-sans text-[9px] uppercase tracking-[0.6em] text-[#c6a664]/40 mt-6 pl-1 font-medium italic">The Institution of Digital Preservation</p>
            </a>

            <div class="max-w-md space-y-6">
              <p class="font-['Inter'] text-sm text-neutral-500 leading-relaxed font-light italic">
                "Art washes away from the soul the dust of everyday life." — We are dedicated to the eternal brilliance of human creativity.
              </p>
              <div class="flex space-x-6">
                <div class="w-8 h-px bg-[#c6a664]/20"></div>
                <span class="text-[8px] uppercase tracking-[0.4em] text-[#c6a664]/60">Artistic heritage foundation</span>
              </div>
            </div>
          </div>

          <!-- Navigation Columns -->
          <div class="space-y-10">
            <h4 class="font-['Cinzel'] text-[#c6a664] text-[10px] uppercase tracking-[0.5em] font-bold">Collections</h4>
            <ul class="space-y-6">
              <li><a routerLink="/gallery" class="text-xs text-neutral-500 hover:text-[#c6a664] transition-colors uppercase tracking-widest font-light">Rennaissance</a></li>
              <li><a routerLink="/gallery" class="text-xs text-neutral-500 hover:text-[#c6a664] transition-colors uppercase tracking-widest font-light">Impressionism</a></li>
              <li><a routerLink="/gallery" class="text-xs text-neutral-500 hover:text-[#c6a664] transition-colors uppercase tracking-widest font-light">Modernism</a></li>
              <li><a routerLink="/frames" class="text-xs text-neutral-500 hover:text-[#c6a664] transition-colors uppercase tracking-widest font-light">The Vault</a></li>
            </ul>
          </div>

          <div class="space-y-10">
            <h4 class="font-['Cinzel'] text-[#c6a664] text-[10px] uppercase tracking-[0.5em] font-bold">The House</h4>
            <ul class="space-y-6">
              <li><a routerLink="/about" class="text-xs text-neutral-500 hover:text-[#c6a664] transition-colors uppercase tracking-widest font-light">Our Story</a></li>
              <li><a routerLink="/gallery" class="text-xs text-neutral-500 hover:text-[#c6a664] transition-colors uppercase tracking-widest font-light">Curation Process</a></li>
              <li><a routerLink="/cart" class="text-xs text-neutral-500 hover:text-[#c6a664] transition-colors uppercase tracking-widest font-light">Acquisition</a></li>
              <li><button class="text-xs text-neutral-500 hover:text-[#c6a664] transition-colors uppercase tracking-widest font-light">Contact</button></li>
            </ul>
          </div>

        </div>

        <!-- System Status & Copyright -->
        <div class="mt-32 pt-12 border-t border-[#c6a664]/5 flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
          <div class="flex items-center space-x-4">
            <span class="text-[8px] text-neutral-700 uppercase tracking-[0.4em]">© 2026 Victoria Institution for Art</span>
            <div class="h-3 w-px bg-neutral-800"></div>
            <span class="text-[8px] text-neutral-700 uppercase tracking-[0.4em]">All Records Protected</span>
          </div>
          
          <div class="flex space-x-12">
            <span class="text-[7px] text-[#c6a664]/20 uppercase tracking-[0.8em]">Secure Auth Phase IV</span>
            <span class="text-[7px] text-[#c6a664]/20 uppercase tracking-[0.8em]">Encrypted Ledger 0xAF</span>
          </div>
        </div>
      </div>

      <!-- Background Decorative Element -->
      <div class="absolute -bottom-20 -right-20 w-[600px] h-[600px] bg-[#c6a664]/[0.02] rounded-full blur-[120px] pointer-events-none"></div>
    </footer>
  `,
  styles: [],
})
export class FooterComponent {}
