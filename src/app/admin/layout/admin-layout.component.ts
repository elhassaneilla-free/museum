import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <div class="min-h-screen bg-[#050505] text-white flex">
      <!-- Admin Sidebar -->
      <aside class="w-64 border-r border-gold/10 bg-black/40 backdrop-blur-xl flex flex-col">
        <div class="p-8 border-b border-gold/10">
          <h1 class="font-['Cinzel'] text-gold text-xl tracking-[0.2em]">VICTORIA</h1>
          <p class="text-[8px] uppercase tracking-[0.4em] text-neutral-500 mt-2 text-center">Backoffice</p>
        </div>

        <nav class="flex-grow p-6 space-y-4">
          <a routerLink="/admin/dashboard" class="flex items-center space-x-4 px-4 py-3 text-gold/60 hover:text-gold hover:bg-gold/5 transition-all text-[10px] uppercase tracking-[0.2em] font-sans">
            Dashboard
          </a>
          <a class="flex items-center space-x-4 px-4 py-3 text-neutral-600 cursor-not-allowed text-[10px] uppercase tracking-[0.2em] font-sans">
            Paintings
          </a>
          <a class="flex items-center space-x-4 px-4 py-3 text-neutral-600 cursor-not-allowed text-[10px] uppercase tracking-[0.2em] font-sans">
            Orders
          </a>
          <a class="flex items-center space-x-4 px-4 py-3 text-neutral-600 cursor-not-allowed text-[10px] uppercase tracking-[0.2em] font-sans">
            Users
          </a>
        </nav>

        <div class="p-6 border-t border-gold/10">
          <button (click)="logout()" class="w-full py-3 border border-gold/10 text-gold/40 hover:text-gold hover:border-gold/30 text-[10px] uppercase tracking-[0.2em] font-sans transition-all">
            Exit Session
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-grow overflow-auto p-12">
        <router-outlet />
      </main>
    </div>
  `,
  styles: []
})
export class AdminLayoutComponent {
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
