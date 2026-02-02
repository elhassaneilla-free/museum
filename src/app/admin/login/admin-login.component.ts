import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-[#020202] flex items-center justify-center p-6">
      <div class="bg-[#080808] border border-gold/20 w-full max-w-md p-12 relative overflow-hidden">
        <!-- Decoration -->
        <div class="absolute top-0 left-0 w-8 h-8 border-t border-l border-gold/40"></div>
        <div class="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-gold/40"></div>

        <div class="text-center mb-12">
          <h1 class="font-serif text-3xl text-gold tracking-widest uppercase mb-4">ADMINISTRATION</h1>
          <div class="w-12 h-px bg-gold/20 mx-auto"></div>
          <p class="font-sans text-[8px] text-neutral-600 uppercase tracking-[0.6em] mt-6">Restricted Vault Access</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="space-y-8">
          <div class="space-y-2">
            <label class="block font-sans text-[8px] uppercase tracking-[0.4em] text-gold/40">Security Identifier</label>
            <input 
              type="text" 
              name="username"
              [(ngModel)]="username"
              class="w-full bg-black/40 border-b border-gold/10 py-3 px-2 font-sans text-sm text-neutral-300 focus:outline-none focus:border-gold/50 transition-all"
            >
          </div>

          <div class="space-y-2">
            <label class="block font-sans text-[8px] uppercase tracking-[0.4em] text-gold/40">Verification Key</label>
            <input 
              type="password" 
              name="password"
              [(ngModel)]="password"
              class="w-full bg-black/40 border-b border-gold/10 py-3 px-2 font-sans text-sm text-neutral-300 focus:outline-none focus:border-gold/50 transition-all"
            >
          </div>

          <div *ngIf="error" class="text-red-500/80 text-[10px] uppercase tracking-widest text-center animate-pulse">
            {{ error }}
          </div>

          <button 
            type="submit"
            class="w-full py-4 mt-8 border border-gold/20 font-sans text-[10px] text-gold uppercase tracking-[0.5em] transition-all hover:bg-gold hover:text-black"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class AdminLoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe({
      next: (res: any) => {
        if (res.role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.error = 'Insufficient Privileges';
          this.authService.logout();
        }
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Invalid Credentials';
      }
    });
  }
}
