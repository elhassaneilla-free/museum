import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="relative w-full bg-[#050505] text-neutral-300 py-32 border-t border-[#c6a664]/20 overflow-hidden font-sans">
      <!-- Artistic Texture Overlay -->
      <div class="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay grayscale brightness-125" 
           style="background-image: url('https://grainy-gradients.vercel.app/noise.svg');"></div>

      <div class="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-20">
          
          <!-- Brand Column -->
          <div class="lg:col-span-2 space-y-12">
            <a routerLink="/" class="group inline-block">
              <div class="flex items-center space-x-6">
                <img src="/assets/logo.png" alt="VICTORIA" class="h-16 w-auto opacity-100 transition-opacity">
                <div class="h-12 w-px bg-[#c6a664]/30 hidden sm:block"></div>
                <span class="font-['Cinzel'] text-3xl text-[#c6a664] tracking-[0.4em] uppercase font-bold drop-shadow-sm">Victoria</span>
              </div>
              <p class="font-sans text-[10px] uppercase tracking-[0.6em] text-[#c6a664]/60 mt-6 pl-1 font-bold italic">The Institution of Digital Preservation</p>
            </a>

            <div class="max-w-md space-y-6">
              <p class="font-['Inter'] text-sm text-neutral-400 leading-relaxed font-light italic">
                "Art washes away from the soul the dust of everyday life." — We are dedicated to the eternal brilliance of human creativity.
              </p>
              <div class="flex space-x-6">
                <div class="w-8 h-px bg-[#c6a664]/30"></div>
                <span class="text-[9px] uppercase tracking-[0.4em] text-[#c6a664]/80 font-bold">Artistic heritage foundation</span>
              </div>
            </div>
          </div>

          <!-- Navigation Columns -->
          <div class="space-y-10">
            <h4 class="font-['Cinzel'] text-[#c6a664] text-[11px] uppercase tracking-[0.5em] font-bold">Collections</h4>
            <ul class="space-y-6">
              <li><a routerLink="/gallery" class="text-xs text-neutral-400 hover:text-[#c6a664] transition-colors uppercase tracking-widest font-medium">Rennaissance</a></li>
              <li><a routerLink="/gallery" class="text-xs text-neutral-400 hover:text-[#c6a664] transition-colors uppercase tracking-widest font-medium">Impressionism</a></li>
              <li><a routerLink="/gallery" class="text-xs text-neutral-400 hover:text-[#c6a664] transition-colors uppercase tracking-widest font-medium">Modernism</a></li>
              <li><a routerLink="/frames" class="text-xs text-neutral-400 hover:text-[#c6a664] transition-colors uppercase tracking-widest font-medium">The Vault</a></li>
            </ul>
          </div>

          <div class="space-y-10">
            <h4 class="font-['Cinzel'] text-[#c6a664] text-[11px] uppercase tracking-[0.5em] font-bold">The House</h4>
            <ul class="space-y-6">
              <li><a routerLink="/about" class="text-xs text-neutral-400 hover:text-[#c6a664] transition-colors uppercase tracking-widest font-medium">Our Story</a></li>
              <li><a routerLink="/gallery" class="text-xs text-neutral-400 hover:text-[#c6a664] transition-colors uppercase tracking-widest font-medium">Curation Process</a></li>
              <li><a routerLink="/cart" class="text-xs text-neutral-400 hover:text-[#c6a664] transition-colors uppercase tracking-widest font-medium">Acquisition</a></li>
              <li><button class="text-xs text-neutral-400 hover:text-[#c6a664] transition-colors uppercase tracking-widest font-medium">Contact</button></li>
            </ul>
          </div>

        </div>

        <!-- System Status & Copyright -->
        <div class="mt-32 pt-12 border-t border-[#c6a664]/10 flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
          <div class="flex items-center space-x-4">
            <span class="text-[9px] text-neutral-500 uppercase tracking-[0.4em] font-bold">© 2026 Victoria Institution for Art</span>
            <div class="h-3 w-px bg-neutral-600"></div>
            <span class="text-[9px] text-neutral-500 uppercase tracking-[0.4em] font-bold">All Records Protected</span>
          </div>
          
          <div class="flex space-x-12">
            <span class="text-[8px] text-[#c6a664]/40 uppercase tracking-[0.8em] font-bold">Secure Auth Phase IV</span>
            <span class="text-[8px] text-[#c6a664]/40 uppercase tracking-[0.8em] font-bold">Encrypted Ledger 0xAF</span>
          </div>
        </div>
      </div>

      <!-- Background Decorative Element -->
      <div class="absolute -bottom-20 -right-20 w-[600px] h-[600px] bg-[#c6a664]/[0.03] rounded-full blur-[120px] pointer-events-none"></div>
    </footer>
    <!-- News Ticker Tape -->
    <div class="relative w-full bg-[#080808] border-t border-[#c6a664]/10 h-8 overflow-hidden flex items-center">
      <div class="flex items-center space-x-12 animate-marquee whitespace-nowrap">
        <!-- Duplicate content for seamless loop -->
        <span *ngFor="let item of items" class="flex items-center text-[10px] text-neutral-400 uppercase tracking-[0.3em] font-['Cinzel'] font-bold">
          <span class="w-1.5 h-1.5 bg-[#c6a664]/60 rounded-full mr-4"></span>
          {{ item }}
        </span>
        <span *ngFor="let item of items" class="flex items-center text-[10px] text-neutral-400 uppercase tracking-[0.3em] font-['Cinzel'] font-bold">
          <span class="w-1.5 h-1.5 bg-[#c6a664]/60 rounded-full mr-4"></span>
          {{ item }}
        </span>
      </div>
       <div class="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#080808] to-transparent z-10"></div>
       <div class="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#080808] to-transparent z-10"></div>
    </div>
  `,
  styles: [`
    .animate-marquee {
      animation: marquee 30s linear infinite;
    }
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  `],
})
export class FooterComponent {
  items = [
    "New Acquisition: The Velvet Collection",
    "Gallery Hours: 09:00 - 18:00",
    "Private Viewings Available by Appointment",
    "Restoration In Progress: 18th Century Oil",
    "Upcoming Exhibition: Shadows of Venice",
    "Membership: Exclusive Access to Vault IV",
    "Digital Archive Status: Online & Secure",
    "Patronage Program: 2026 Enrollment Open"
  ];
}
