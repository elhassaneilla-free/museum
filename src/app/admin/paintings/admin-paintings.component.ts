import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Painting } from '../../services/data.service';

@Component({
  selector: 'app-admin-paintings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-12 animate-in fade-in duration-700">
      <header class="flex justify-between items-end">
        <div>
          <h2 class="font-serif text-4xl text-gold tracking-wide italic">Curatorial Management</h2>
          <p class="font-sans text-[10px] text-neutral-500 uppercase tracking-[0.4em] mt-2">Inventory Control • Private Vault</p>
        </div>
        <button 
          (click)="openAddModal()"
          class="px-8 py-3 border border-gold/20 text-gold text-[10px] uppercase tracking-[0.3em] hover:bg-gold hover:text-black transition-all duration-500"
        >
          Catalog New Acquisition
        </button>
      </header>

      <!-- Paintings Table -->
      <div class="border border-gold/10 bg-black/40 backdrop-blur-sm overflow-hidden">
        <table class="w-full text-left font-sans text-[11px] uppercase tracking-widest text-neutral-400">
          <thead>
            <tr class="border-b border-gold/10 bg-gold/5">
              <th class="px-6 py-4 font-normal text-gold/60">ID</th>
              <th class="px-6 py-4 font-normal text-gold/60">Artwork</th>
              <th class="px-6 py-4 font-normal text-gold/60">Artist</th>
              <th class="px-6 py-4 font-normal text-gold/60">Price</th>
              <th class="px-6 py-4 font-normal text-gold/60">Status</th>
              <th class="px-6 py-4 font-normal text-gold/60 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gold/5">
            <tr *ngFor="let p of paintings" class="hover:bg-white/[0.02] transition-colors group">
              <td class="px-6 py-6 font-mono text-neutral-600">#{{ p.id }}</td>
              <td class="px-6 py-6 font-serif text-neutral-200 text-sm tracking-normal italic">{{ p.title }}</td>
              <td class="px-6 py-6">{{ p.artist }}</td>
              <td class="px-6 py-6 text-gold/80">{{ p.price }}</td>
              <td class="px-6 py-6">
                <span [class]="p.availability ? 'text-green-500/60' : 'text-red-500/60'">
                  {{ p.availability ? 'Available' : 'Reserved' }}
                </span>
              </td>
              <td class="px-6 py-6 text-right space-x-4">
                <button (click)="openEditModal(p)" class="text-gold/40 hover:text-gold transition-colors">Edit</button>
                <button (click)="deletePainting(p.id)" class="text-red-900/40 hover:text-red-500 transition-colors">Deaccession</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Simple Modal (Hidden by default) -->
      <div *ngIf="isModalOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
        <div class="bg-[#0a0a0a] border border-gold/20 p-12 w-full max-w-2xl relative shadow-2xl">
           <button (click)="closeModal()" class="absolute top-6 right-6 text-gold/40 hover:text-gold transition-colors">✕</button>
           
           <h3 class="font-serif text-2xl text-gold mb-8 italic">{{ editMode ? 'Modify Record' : 'Catalog New Artwork' }}</h3>
           
           <form (submit)="savePainting()" class="grid grid-cols-2 gap-8">
             <div class="space-y-4">
               <div>
                 <label class="block text-[8px] text-gold/40 uppercase tracking-widest mb-1">Title</label>
                 <input [(ngModel)]="currentPainting.title" name="title" class="w-full bg-black/40 border border-gold/10 p-3 text-neutral-300 focus:outline-none focus:border-gold/40">
               </div>
               <div>
                 <label class="block text-[8px] text-gold/40 uppercase tracking-widest mb-1">Artist</label>
                 <input [(ngModel)]="currentPainting.artist" name="artist" class="w-full bg-black/40 border border-gold/10 p-3 text-neutral-300 focus:outline-none focus:border-gold/40">
               </div>
               <div>
                 <label class="block text-[8px] text-gold/40 uppercase tracking-widest mb-1">Price</label>
                 <input [(ngModel)]="currentPainting.price" name="price" class="w-full bg-black/40 border border-gold/10 p-3 text-neutral-300 focus:outline-none focus:border-gold/40">
               </div>
             </div>
             <div class="space-y-4">
               <div>
                 <label class="block text-[8px] text-gold/40 uppercase tracking-widest mb-1">Image Path</label>
                 <input [(ngModel)]="currentPainting.image" name="image" class="w-full bg-black/40 border border-gold/10 p-3 text-neutral-300 focus:outline-none focus:border-gold/40">
               </div>
               <div>
                 <label class="block text-[8px] text-gold/40 uppercase tracking-widest mb-1">Category</label>
                 <input [(ngModel)]="currentPainting.category" name="category" class="w-full bg-black/40 border border-gold/10 p-3 text-neutral-300 focus:outline-none focus:border-gold/40">
               </div>
               <div>
                 <label class="block text-[8px] text-gold/40 uppercase tracking-widest mb-1">Availability</label>
                 <select [(ngModel)]="currentPainting.availability" name="availability" class="w-full bg-black/40 border border-gold/10 p-3 text-neutral-300 focus:outline-none focus:border-gold/40">
                   <option [ngValue]="1">Available</option>
                   <option [ngValue]="0">Reserved</option>
                 </select>
               </div>
             </div>
             <div class="col-span-2">
               <label class="block text-[8px] text-gold/40 uppercase tracking-widest mb-1">Description</label>
               <textarea [(ngModel)]="currentPainting.description" name="description" rows="3" class="w-full bg-black/40 border border-gold/10 p-3 text-neutral-300 focus:outline-none focus:border-gold/40"></textarea>
             </div>
             
             <div class="col-span-2 pt-4">
               <button type="submit" class="w-full py-4 bg-gold text-black uppercase tracking-[0.4em] text-[10px] font-bold hover:bg-gold/80 transition-all">
                 Commit to Vault
               </button>
             </div>
           </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AdminPaintingsComponent implements OnInit {
  paintings: Painting[] = [];
  isModalOpen = false;
  editMode = false;
  currentPainting: Partial<Painting> = {};

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadPaintings();
  }

  loadPaintings() {
    this.dataService.getPaintings().subscribe(data => this.paintings = data);
  }

  openAddModal() {
    this.editMode = false;
    this.currentPainting = { availability: 1 };
    this.isModalOpen = true;
  }

  openEditModal(p: Painting) {
    this.editMode = true;
    this.currentPainting = { ...p };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  savePainting() {
    const action = this.editMode 
      ? this.dataService.updatePainting(this.currentPainting.id!, this.currentPainting)
      : this.dataService.createPainting(this.currentPainting);

    (action as any).subscribe({
      next: () => {
        this.loadPaintings();
        this.closeModal();
      }
    });
  }

  deletePainting(id: number) {
    if (confirm('Are you sure you want to deaccession this artwork?')) {
      this.dataService.deletePainting(id).subscribe(() => this.loadPaintings());
    }
  }
}
