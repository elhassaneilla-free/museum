import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <div class="min-h-screen bg-[#050505] text-[#e5e5e5] flex relative overflow-hidden font-sans">
      <!-- Grain Overlay -->
      <div class="absolute inset-0 pointer-events-none opacity-[0.03] contrast-150 grayscale mix-blend-overlay" 
           style="background-image: url('https://grainy-gradients.vercel.app/noise.svg');"></div>

      <!-- Admin Sidebar -->
      <aside class="w-72 border-r border-[#c6a664]/10 bg-[#080808] flex flex-col relative z-10 shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
        <div class="p-10 border-b border-[#c6a664]/5 relative group">
          <div class="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#c6a664]/20"></div>
          <h1 class="font-['Cinzel'] text-[#c6a664] text-2xl tracking-[0.3em] font-bold">VICTORIA</h1>
          <p class="text-[7px] uppercase tracking-[0.6em] text-[#c6a664]/40 mt-3 font-medium">Internal Administration</p>
        </div>

        <nav class="flex-grow p-8 space-y-2">
          <div class="text-[8px] uppercase tracking-[0.4em] text-neutral-600 mb-6 pl-4 font-bold">Navigation</div>
          
          <a routerLink="/admin/dashboard" routerLinkActive="active-link" 
             class="nav-item group">
            <span class="nav-icon">◈</span>
            <span class="nav-text">Dashboard</span>
            <div class="nav-indicator"></div>
          </a>
          
          <a routerLink="/admin/paintings" routerLinkActive="active-link" 
             class="nav-item group">
            <span class="nav-icon">◈</span>
            <span class="nav-text">Paintings</span>
            <div class="nav-indicator"></div>
          </a>
          
          <a routerLink="/admin/orders" routerLinkActive="active-link" 
             class="nav-item group">
            <span class="nav-icon">◈</span>
            <span class="nav-text">Orders</span>
            <div class="nav-indicator"></div>
          </a>
          
          <a routerLink="/admin/users" routerLinkActive="active-link" 
             class="nav-item group">
            <span class="nav-icon">◈</span>
            <span class="nav-text">Users</span>
            <div class="nav-indicator"></div>
          </a>
        </nav>

        <div class="p-8 border-t border-[#c6a664]/5">
          <button (click)="logout()" 
                  class="w-full py-4 border border-[#c6a664]/10 text-[#c6a664]/40 hover:text-[#c6a664] hover:bg-[#c6a664]/5 hover:border-[#c6a664]/30 text-[9px] uppercase tracking-[0.4em] font-bold transition-all duration-500 rounded-sm">
            TERMINATE SESSION
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-grow overflow-auto relative z-10 custom-scrollbar">
        <div class="max-w-[1600px] mx-auto p-16 h-full">
          <router-outlet />
        </div>
      </main>
    </div>
  `,
  styles: [`
    .nav-item {
      display: flex;
      align-items: center;
      padding: 1rem 1rem;
      color: rgba(198, 166, 100, 0.4);
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.3em;
      transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
      position: relative;
      border-radius: 2px;
    }
    .nav-item:hover {
      color: #c6a664;
      background: rgba(198, 166, 100, 0.03);
    }
    .active-link {
      color: #c6a664 !important;
      background: rgba(198, 166, 100, 0.05) !important;
    }
    .active-link .nav-indicator {
      width: 2px;
      height: 60%;
      background: #c6a664;
      position: absolute;
      left: 0;
      opacity: 1;
      box-shadow: 0 0 10px rgba(198, 166, 100, 0.5);
    }
    .nav-icon {
      font-size: 8px;
      margin-right: 1.25rem;
      opacity: 0.3;
      transition: opacity 0.5s;
    }
    .nav-item:hover .nav-icon {
      opacity: 1;
    }
    .nav-indicator {
      width: 0;
      height: 0;
      opacity: 0;
      transition: all 0.5s;
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(198, 166, 100, 0.1);
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(198, 166, 100, 0.3);
    }
  `]
})
export class AdminLayoutComponent {
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
