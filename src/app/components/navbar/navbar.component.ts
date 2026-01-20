import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styles: []
})
export class NavbarComponent implements AfterViewInit {
  @ViewChild('navLinks') navLinks!: ElementRef;

  ngAfterViewInit() {
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
