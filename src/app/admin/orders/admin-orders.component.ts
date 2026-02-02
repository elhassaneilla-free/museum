import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Order } from '../../services/data.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-12 animate-in fade-in duration-700">
      <header>
        <h2 class="font-serif text-4xl text-gold tracking-wide italic">Acquisition History</h2>
        <p class="font-sans text-[10px] text-neutral-500 uppercase tracking-[0.4em] mt-2">Transaction Ledger • Victoria Institution</p>
      </header>

      <!-- Orders List -->
      <div class="grid grid-cols-1 gap-6">
        <div *ngFor="let order of orders" class="border border-gold/10 bg-black/40 backdrop-blur-sm p-8 group">
          <div class="flex justify-between items-start mb-8">
            <div>
              <div class="text-gold/40 text-[9px] uppercase tracking-widest mb-1">Transaction ID</div>
              <div class="font-mono text-xs text-neutral-300">#ORD-{{ 1000 + order.id }}</div>
            </div>
            <div class="text-right">
              <div class="text-gold/40 text-[9px] uppercase tracking-widest mb-1">Date catalogued</div>
              <div class="text-xs text-neutral-400 font-sans tracking-widest uppercase">{{ order.date | date:'dd.MM.yyyy HH:mm' }}</div>
            </div>
          </div>

          <div class="flex flex-col md:flex-row gap-12">
            <!-- Items -->
            <div class="flex-grow space-y-4">
              <div *ngFor="let item of order.items" class="flex items-center space-x-6">
                <div class="w-12 h-16 bg-neutral-900 overflow-hidden border border-gold/5 flex-shrink-0">
                  <img [src]="item.image" class="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                </div>
                <div>
                  <div class="font-serif text-sm text-neutral-200 italic">{{ item.productTitle }}</div>
                  <div class="text-[9px] text-neutral-500 uppercase tracking-widest">{{ item.artist }} • {{ item.variant }}</div>
                </div>
              </div>
            </div>

            <!-- Summary & Actions -->
            <div class="w-full md:w-64 space-y-6">
              <div class="border-t border-gold/10 pt-4">
                <div class="flex justify-between items-center mb-6">
                  <span class="text-[9px] text-neutral-500 uppercase tracking-widest">Collector</span>
                  <span class="text-[10px] text-gold uppercase tracking-widest font-bold">{{ order.user }}</span>
                </div>
                <div class="flex justify-between items-center mb-8">
                  <span class="text-[9px] text-neutral-500 uppercase tracking-widest">Investment</span>
                  <span class="text-lg text-gold font-serif italic">€{{ order.total | number }}</span>
                </div>
                
                <div class="space-y-3">
                   <div class="text-[8px] text-gold/40 uppercase tracking-widest mb-2">Operational Status</div>
                   <select 
                    [value]="order.status"
                    (change)="updateStatus(order.id, $event)"
                    class="w-full bg-black/60 border border-gold/20 p-3 text-gold text-[10px] uppercase tracking-[0.2em] focus:outline-none focus:border-gold transition-all"
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
  orders: Order[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.dataService.getOrders().subscribe(data => {
      this.orders = data.reverse(); // Newest first
    });
  }

  updateStatus(orderId: number, event: any) {
    const status = event.target.value;
    this.dataService.updateOrderStatus(orderId, status).subscribe(() => {
      this.loadOrders();
    });
  }
}
