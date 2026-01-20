import { Component } from '@angular/core';
import { HeroComponent } from './hero/hero.component';
import { IntroductionComponent } from './introduction/introduction.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, IntroductionComponent],
  template: `
    <app-hero></app-hero>
    <app-introduction></app-introduction>
  `,
})
export class HomeComponent {}
