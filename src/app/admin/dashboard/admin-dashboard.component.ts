import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-16 animate-in fade-in duration-1000">
      <!-- Top Section -->
      <header class="flex justify-between items-start">
        <div class="space-y-2">
          <h2 class="font-['Cinzel'] text-5xl text-[#c6a664] tracking-[0.1em] font-light drop-shadow-lg">Victoria — Administration</h2>
          <p class="font-sans text-[11px] text-neutral-400 uppercase tracking-[0.8em] pl-1 font-medium italic">Curating Art, Managing Legacy</p>
        </div>
        <div class="text-right pt-2 border-t border-[#c6a664]/20">
          <p class="font-['Cinzel'] text-[11px] text-[#c6a664] tracking-widest font-bold">{{ today | date:'EEEE, MMMM d, yyyy' | uppercase }}</p>
          <div class="flex items-center justify-end space-x-2 mt-2">
            <span class="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            <span class="text-[10px] text-neutral-300 uppercase tracking-widest font-bold">System Status: Nominal</span>
          </div>
        </div>
      </header>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div *ngFor="let stat of stats" 
             class="group relative h-40 bg-[#0a0a0a] border border-[#c6a664]/20 p-8 flex flex-col justify-between transition-all duration-700 hover:border-[#c6a664]/60 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
          <div class="absolute top-0 right-0 w-16 h-16 bg-[#c6a664]/[0.05] -rotate-45 translate-x-8 -translate-y-8"></div>
          
          <div class="relative z-10">
            <p class="text-[10px] uppercase tracking-[0.5em] text-neutral-400 font-bold group-hover:text-[#c6a664] transition-colors uppercase">{{ stat.label }}</p>
            <div class="w-8 h-px bg-[#c6a664]/40 mt-3 group-hover:w-12 transition-all duration-700"></div>
          </div>
          
          <h3 class="font-['Cinzel'] text-4xl text-[#c6a664] tracking-wider group-hover:scale-110 origin-left transition-transform duration-700 drop-shadow-md">{{ stat.value }}</h3>
          
          <!-- Decorative Corner -->
          <div class="absolute bottom-4 right-4 text-[11px] text-[#c6a664]/30 group-hover:text-[#c6a664]/60 transition-colors">
            <span class="font-serif">№</span>
          </div>
        </div>
      </div>

      <!-- Analytics Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-10">
        <!-- Line Chart: Orders over time -->
        <div class="chart-container group border border-[#c6a664]/10 bg-[#080808]/70 p-12 relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#c6a664]/40 to-transparent"></div>
          <h4 class="font-serif text-[#c6a664] text-xs uppercase tracking-[0.4em] mb-12 flex justify-between font-bold">
            <span>Market Demand</span>
            <span class="text-[10px] italic font-sans text-neutral-400">Period: 30D</span>
          </h4>
          
          <div class="h-64 relative flex items-end justify-between px-2">
            <!-- Grid Lines -->
            <div class="absolute inset-0 flex flex-col justify-between opacity-[0.1]">
              <div *ngFor="let i of [1,2,3,4]" class="w-full h-px bg-[#c6a664]"></div>
            </div>
            
            <!-- SVG Line Chart -->
            <svg class="absolute inset-x-0 bottom-0 w-full h-full pb-4" preserveAspectRatio="none">
              <defs>
                <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#c6a664" stop-opacity="0.3"/>
                  <stop offset="100%" stop-color="#c6a664" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <path d="M0,80 Q50,40 100,100 T200,60 T300,120 T400,20 T500,80 T600,10 L700,50" 
                    fill="none" stroke="#c6a664" stroke-width="2" stroke-dasharray="1000" stroke-dashoffset="0" class="animate-draw" />
              <path d="M0,80 Q50,40 100,100 T200,60 T300,120 T400,20 T500,80 T600,10 L700,50 V150 H0 Z" 
                    fill="url(#orderGrad)" class="opacity-0 group-hover:opacity-100 transition-opacity duration-1000"/>
            </svg>

            <!-- Labels -->
            <div *ngFor="let month of ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL']" 
                 class="text-[9px] text-neutral-400 tracking-widest mt-4 relative z-10 font-bold">{{ month }}</div>
          </div>
        </div>

        <!-- Bar Chart: Monthly Revenue -->
        <div class="chart-container group border border-[#c6a664]/10 bg-[#080808]/70 p-12 relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#c6a664]/40 to-transparent"></div>
          <h4 class="font-serif text-[#c6a664] text-xs uppercase tracking-[0.4em] mb-12 flex justify-between font-bold">
            <span>Asset Performance</span>
            <span class="text-[10px] italic font-sans text-neutral-400 text-right uppercase">Yield per Category</span>
          </h4>
          
          <div class="h-64 flex items-end justify-around space-x-6 px-4">
            <div *ngFor="let bar of [70, 45, 90, 60, 85, 40]" 
                 class="relative w-full bg-[#c6a664]/20 group/bar flex flex-col items-center" 
                 [style.height.%]="bar">
              <div class="absolute inset-0 bg-[#c6a664]/40 scale-y-0 group-hover/bar:scale-y-100 origin-bottom transition-transform duration-700"></div>
              <div class="absolute -top-6 text-[10px] text-[#c6a664] opacity-0 group-hover/bar:opacity-100 transition-opacity font-mono font-bold">{{ bar }}%</div>
            </div>
          </div>
          
          <div class="flex justify-around mt-8">
            <div *ngFor="let label of ['REN', 'MOD', 'P-IMP', 'DUT', 'IMP', 'REA']" 
                 class="text-[9px] text-neutral-400 tracking-widest font-bold">{{ label }}</div>
          </div>
        </div>
      </div>

      <!-- Donut Chart & Status Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-16 mt-10">
        <div class="lg:col-span-1 border border-[#c6a664]/10 bg-[#080808]/70 p-12 flex flex-col items-center">
          <h4 class="font-serif text-[#c6a664] text-[11px] uppercase tracking-[0.5em] mb-12 w-full text-center font-bold">Acquisition Status</h4>
          
          <div class="relative w-48 h-48">
            <svg viewBox="0 0 36 36" class="w-full h-full transform -rotate-90">
              <path class="stroke-[#c6a664]/10" stroke-dasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke-width="2.5"></path>
              <path class="stroke-[#c6a664] transition-all duration-1000" stroke-dasharray="64, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke-width="2.5"></path>
              <path class="stroke-[#c6a664]/30 transition-all duration-1000" stroke-dasharray="21, 100" stroke-dashoffset="-64" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke-width="2.5"></path>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="font-['Cinzel'] text-3xl text-[#c6a664] italic drop-shadow-md">85%</span>
              <span class="text-[9px] text-neutral-400 uppercase tracking-widest mt-1 font-bold">Efficiency</span>
            </div>
          </div>
          
          <div class="mt-10 space-y-3 w-full max-w-[150px]">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 rounded-full bg-[#c6a664]"></div>
                <span class="text-[9px] text-neutral-300 uppercase tracking-widest font-bold">Completed</span>
              </div>
              <span class="text-[10px] text-[#c6a664] font-mono font-bold">64</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 rounded-full bg-[#c6a664]/30"></div>
                <span class="text-[9px] text-neutral-300 uppercase tracking-widest font-bold">Pending</span>
              </div>
              <span class="text-[10px] text-[#c6a664]/60 font-mono font-bold">21</span>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2 border border-[#c6a664]/10 bg-[#080808]/70 p-12">
          <h4 class="font-serif text-[#c6a664] text-[11px] uppercase tracking-[0.5em] mb-10 font-bold">Protocol Logs</h4>
          <div class="space-y-4">
            <div *ngFor="let log of logs" class="flex items-center justify-between p-4 border-b border-[#c6a664]/10 group/row hover:bg-[#c6a664]/[0.05] transition-colors">
              <div class="flex items-center space-x-6">
                <span class="font-mono text-[10px] text-neutral-400 uppercase font-bold">{{ log.time }}</span>
                <span class="text-[11px] text-neutral-300 group-hover:text-white transition-colors tracking-wide">{{ log.event }}</span>
              </div>
              <span class="text-[9px] text-[#c6a664]/60 border border-[#c6a664]/20 px-3 py-1 uppercase tracking-widest font-bold">{{ log.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes draw {
      from { stroke-dashoffset: 1000; }
      to { stroke-dashoffset: 0; }
    }
    .animate-draw {
      animation: draw 3s ease-in-out forwards;
    }
  `]
})
export class AdminDashboardComponent {
  today = new Date();
  
  stats = [
    { label: 'Total Paintings', value: '27' },
    { label: 'Total Orders', value: '856' },
    { label: 'Verified Users', value: '1,204' },
    { label: 'Revenue Yield', value: '€2.4B' }
  ];

  logs = [
    { time: '14:22:01', event: 'Vault access authorized - Admin session 0x71', status: 'OK' },
    { time: '12:05:43', event: 'New acquisition catalogued: "Nighthawks" - Hopper', status: 'COMPLETED' },
    { time: '09:15:12', event: 'Database synchronization with museum cluster', status: 'SUCCESS' },
    { time: '04:30:00', event: 'Automated backup of private collections', status: 'OK' }
  ];
}
