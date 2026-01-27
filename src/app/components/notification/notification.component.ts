import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="notificationService.activeNotification() as note" 
         [@fadeInOut]
         class="fixed bottom-12 right-12 z-[200] flex items-center">
      <div class="bg-black/80 backdrop-blur-xl border border-gold/30 px-8 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-end">
        <div class="text-gold/40 text-[8px] uppercase tracking-[0.4em] mb-1">Acquisition Confirmed</div>
        <div class="text-white font-serif text-lg tracking-wider">{{ note.message }}</div>
        <div *ngIf="note.artist" class="text-gold/60 text-[10px] uppercase tracking-[0.2em] mt-1 italic">{{ note.artist }}</div>
        <div class="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gold shadow-[0_0_10px_#c6a664]"></div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('800ms cubic-bezier(0.2, 0.8, 0.2, 1)', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('600ms cubic-bezier(0.2, 0.8, 0.2, 1)', style({ opacity: 0, transform: 'translateX(30px)' }))
      ])
    ])
  ]
})
export class NotificationComponent {
  constructor(public notificationService: NotificationService) {}
}
