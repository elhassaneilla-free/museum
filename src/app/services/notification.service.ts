import { Injectable, signal } from '@angular/core';

export interface MuseumNotification {
  message: string;
  artist?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  activeNotification = signal<MuseumNotification | null>(null);

  show(message: string, artist?: string) {
    this.activeNotification.set({ message, artist });
    
    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      this.activeNotification.set(null);
    }, 4000);
  }

  clear() {
    this.activeNotification.set(null);
  }
}
