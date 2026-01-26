import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { gsap } from 'gsap';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styles: []
})
export class NavbarComponent implements AfterViewInit {
  @ViewChild('navLinks') navLinks!: ElementRef;
  isLoginOpen = false;

  username = '';
  password = '';
  error = '';

  constructor(public authService: AuthService) {}

  toggleLogin() {
    this.isLoginOpen = !this.isLoginOpen;
    this.error = '';
  }

  onLogin() {
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.isLoginOpen = false;
        this.username = '';
        this.password = '';
      },
      error: () => {
        this.error = 'Invalid credentials';
      }
    });
  }

  onLogout() {
    this.authService.logout();
  }

  ngAfterViewInit() {
    if (this.navLinks) {
      gsap.fromTo(this.navLinks.nativeElement.children, 
        { opacity: 0, y: -20 },
        { 
          duration: 1.5, 
          opacity: 1, 
          y: 0, 
          stagger: 0.2, 
          ease: 'power2.out',
          delay: 0.5 
        }
      );
    }
  }
}
