import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { NotificationComponent } from './components/notification/notification.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, NotificationComponent, CommonModule],
  template: `
    <div *ngIf="isVaultDown" class="fixed top-0 left-0 w-full bg-red-900/90 text-white p-2 text-[10px] uppercase tracking-[0.4em] text-center z-[1000] backdrop-blur-md border-b border-white/10">
      ⚠️ Private Vault Offline — Institutional Systems Unreachable
    </div>
    <app-navbar *ngIf="!isAdminRoute"></app-navbar>
    <router-outlet />
    <app-footer *ngIf="!isAdminRoute"></app-footer>
    <app-notification></app-notification>
  `,
  styles: [],
})
export class App implements OnInit {
  isAdminRoute = false;
  isVaultDown = false;

  constructor(private router: Router, private http: HttpClient) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isAdminRoute = event.urlAfterRedirects.startsWith('/admin');
    });
  }

  ngOnInit() {
    this.checkVaultHealth();
    // Re-check health every 30 seconds
    setInterval(() => this.checkVaultHealth(), 30000);
  }

  checkVaultHealth() {
    this.http.get('http://127.0.0.1:3000/api/health').subscribe({
      next: () => this.isVaultDown = false,
      error: () => this.isVaultDown = true
    });
  }
}
