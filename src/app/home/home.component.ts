import { Component } from '@angular/core';
import { HeroComponent } from './hero/hero.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { VictoriaHeritageBookComponent } from './victoria-heritage-book/victoria-heritage-book.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, IntroductionComponent, VictoriaHeritageBookComponent],
  template: `
    <app-hero></app-hero>
    <app-introduction></app-introduction>
    <app-victoria-heritage-book></app-victoria-heritage-book>
  `,
})
export class HomeComponent {}
