import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-12">
      <!-- Header -->
      <header class="flex justify-between items-end">
        <div>
          <h2 class="font-serif text-4xl text-gold tracking-wide italic">Executive Dashboard</h2>
          <p class="font-sans text-[10px] text-neutral-500 uppercase tracking-[0.4em] mt-2">Operational Overview • Victoria Institution</p>
        </div>
        <div class="text-right">
          <p class="font-mono text-[10px] text-gold/40">SESS_ID: 0XAF8221</p>
          <p class="font-sans text-[10px] text-neutral-500 uppercase tracking-widest">{{ today | date:'dd.MM.yyyy' }}</p>
        </div>
      </header>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div *ngFor="let stat of stats" class="p-8 border border-gold/10 bg-black/40 backdrop-blur-sm relative group overflow-hidden">
          <div class="absolute inset-0 bg-gold/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
          <div class="relative z-10">
            <p class="text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-6">{{ stat.label }}</p>
            <h3 class="font-serif text-3xl text-gold">{{ stat.value }}</h3>
          </div>
        </div>
      </div>

      <!-- Recent Activity Section -->
      <section class="border border-gold/10 bg-black/20 p-10">
        <h3 class="font-serif text-xl text-gold tracking-widest uppercase mb-8">System Logs</h3>
        <div class="space-y-6">
          <div *ngFor="let log of logs" class="flex items-center space-x-6 py-4 border-b border-gold/5 font-sans text-[10px] text-neutral-400">
            <span class="text-gold/30 font-mono">{{ log.time }}</span>
            <span class="uppercase tracking-widest flex-grow">{{ log.event }}</span>
            <span class="text-gold opacity-40 px-3 py-1 border border-gold/10 bg-gold/5 tracking-[0.2em]">{{ log.status }}</span>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: []
})
export class AdminDashboardComponent {
  today = new Date();
  
  stats = [
    { label: 'Total Paintings', value: '24' },
    { label: 'Active Exhibitions', value: '6' },
    { label: 'Private Guests', value: '142' },
    { label: 'Vault Value', value: '€2.4B' }
  ];

  logs = [
    { time: '14:22:01', event: 'Vault access authorized - Admin session start', status: 'OK' },
    { time: '12:05:43', event: 'New acquisition catalogued: "Nighthawks" - Hopper', status: 'COMPLETED' },
    { time: '09:15:12', event: 'Database synchronization with museum cluster', status: 'SUCCESS' },
    { time: '04:30:00', event: 'Automated backup of private collections', status: 'OK' }
  ];
}
