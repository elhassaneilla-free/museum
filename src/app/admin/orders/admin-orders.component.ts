import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Order } from '../../services/data.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-12 animate-in fade-in duration-700">
      <header class="flex justify-between items-end">
        <div>
          <h2 class="font-serif text-4xl text-[#c6a664] tracking-wide italic drop-shadow-md">Acquisition History</h2>
          <p class="font-sans text-[11px] text-neutral-400 uppercase tracking-[0.4em] mt-2 font-medium">Transaction Ledger • Victoria Institution</p>
        </div>
        <button 
          (click)="clearVerifiedOrders()"
          class="px-8 py-3 border border-[#c6a664]/20 text-[#c6a664] text-[10px] uppercase tracking-[0.3em] hover:bg-[#c6a664] hover:text-black transition-all duration-500 font-bold"
        >
          Archive Verified Records
        </button>
      </header>

      <!-- Orders List -->
      <div class="grid grid-cols-1 gap-6">
        <div *ngFor="let order of orders()" class="border border-[#c6a664]/10 bg-black/40 backdrop-blur-sm p-8 group transition-colors hover:border-[#c6a664]/30">
          <div class="flex justify-between items-start mb-8">
            <div>
              <div class="text-[#c6a664] text-[9px] uppercase tracking-widest mb-1 font-bold">Transaction ID</div>
              <div class="font-mono text-xs text-neutral-200">#ORD-{{ 1000 + order.id }}</div>
            </div>
            <div class="text-right">
              <div class="text-[#c6a664] text-[9px] uppercase tracking-widest mb-1 font-bold">Date catalogued</div>
              <div class="text-xs text-neutral-300 font-sans tracking-widest uppercase">{{ order.date | date:'dd.MM.yyyy HH:mm' }}</div>
            </div>
          </div>

          <div class="flex flex-col md:flex-row gap-12">
            <!-- Items -->
            <div class="flex-grow space-y-4">
              <div *ngFor="let item of order.items" class="flex items-center space-x-6">
                <div class="w-12 h-16 bg-neutral-900 overflow-hidden border border-[#c6a664]/5 flex-shrink-0">
                  <img [src]="item.image" class="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                </div>
                <div>
                  <div class="font-serif text-sm text-white italic tracking-wide">{{ item.productTitle }}</div>
                  <div class="text-[9px] text-neutral-400 uppercase tracking-widest">{{ item.artist }} • {{ item.variant }}</div>
                </div>
              </div>
            </div>

            <!-- Summary & Actions -->
            <div class="w-full md:w-64 space-y-6">
              <div class="border-t border-[#c6a664]/10 pt-4">
                <div class="flex justify-between items-center mb-6">
                  <span class="text-[9px] text-neutral-400 uppercase tracking-widest font-bold">Collector</span>
                  <span class="text-[10px] text-[#c6a664] uppercase tracking-widest font-bold">{{ order.user }}</span>
                </div>
                <div class="flex justify-between items-center mb-8">
                  <span class="text-[9px] text-neutral-400 uppercase tracking-widest font-bold">Investment</span>
                  <span class="text-lg text-[#c6a664] font-serif italic drop-shadow-sm">€{{ order.total | number }}</span>
                </div>
                
                <div class="space-y-3">
                   <div class="text-[9px] text-[#c6a664] uppercase tracking-widest mb-2 font-bold">Operational Status</div>
                   <select 
                    [value]="order.status"
                    (change)="updateStatus(order.id, $event)"
                    class="w-full bg-black/60 border border-[#c6a664]/20 p-3 text-[#c6a664] text-[10px] uppercase tracking-[0.2em] focus:outline-none focus:border-[#c6a664] transition-all font-bold"
                   >
                     <option value="pending">Pending Authentication</option>
                     <option value="validated">Verified</option>
                     <option value="shipped">In Transit</option>
                     <option value="cancelled">Revoked</option>
                   </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AdminOrdersComponent implements OnInit {
  private dataService = inject(DataService);
  orders = computed(() => [...this.dataService.orders()].reverse());

  constructor() {}

  ngOnInit() {
    this.dataService.getOrders().subscribe();
  }

  updateStatus(orderId: number, event: any) {
    const status = event.target.value;
    this.dataService.updateOrderStatus(orderId, status).subscribe();
  }

  clearVerifiedOrders() {
    const allOrders = this.orders();
    
    if (allOrders.length === 0) {
      alert('The ledger is already empty.');
      return;
    }

    if (confirm(`Clear all acquisition records from the ledger? This will remove ${allOrders.length} transactions.`)) {
      this.dataService.deleteAllOrders().subscribe({
        next: () => {
          alert('Ledger cleared. All records have been archived.');
        },
        error: () => {
          alert('An error occurred while clearing the ledger.');
        }
      });
    }
  }
}
