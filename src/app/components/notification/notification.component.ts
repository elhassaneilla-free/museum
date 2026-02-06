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
      <div class="bg-black/90 backdrop-blur-2xl border-2 border-gold/40 px-10 py-5 shadow-[0_30px_60px_rgba(0,0,0,0.8)] flex flex-col items-end relative overflow-hidden">
        <!-- Texture Overlay -->
        <div class="absolute inset-0 pointer-events-none opacity-[0.03] grayscale brightness-125" style="background-image: url('https://grainy-gradients.vercel.app/noise.svg');"></div>
        
        <div class="text-gold text-[10px] uppercase tracking-[0.5em] mb-2 font-bold drop-shadow-sm">System Update</div>
        <div class="text-white font-serif text-xl tracking-wider drop-shadow-md italic">{{ note.message }}</div>
        <div *ngIf="note.artist" class="text-gold text-[11px] uppercase tracking-[0.2em] mt-2 italic font-medium drop-shadow-sm">{{ note.artist }}</div>
        <div class="absolute -left-1 top-0 bottom-0 w-1 bg-gold shadow-[0_0_15px_#c6a664]"></div>
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
