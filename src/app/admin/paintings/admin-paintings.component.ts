import { Component, OnInit, inject } from '@angular/core';
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
          <h2 class="font-serif text-4xl text-[#c6a664] tracking-wide italic drop-shadow-md">Curatorial Management</h2>
          <p class="font-sans text-[11px] text-neutral-400 uppercase tracking-[0.4em] mt-2 font-medium">Inventory Control • Private Vault</p>
        </div>
        <button 
          (click)="openAddModal()"
          class="px-8 py-3 border border-[#c6a664]/20 text-[#c6a664] text-[10px] uppercase tracking-[0.3em] hover:bg-[#c6a664] hover:text-black transition-all duration-500 font-bold"
        >
          Catalog New Acquisition
        </button>
      </header>

      <!-- Paintings Table -->
      <div class="border border-[#c6a664]/10 bg-black/40 backdrop-blur-sm overflow-hidden flex flex-col shadow-2xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left font-sans text-[11px] uppercase tracking-widest text-neutral-400">
            <thead>
              <tr class="border-b border-[#c6a664]/10 bg-[#c6a664]/5">
                <th class="px-6 py-4 font-normal text-[#c6a664]">ID</th>
                <th class="px-6 py-4 font-normal text-[#c6a664]">Artwork</th>
                <th class="px-6 py-4 font-normal text-[#c6a664]">Artist</th>
                <th class="px-6 py-4 font-normal text-[#c6a664]">Price</th>
                <th class="px-6 py-4 font-normal text-[#c6a664]">Status</th>
                <th class="px-6 py-4 font-normal text-[#c6a664] text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#c6a664]/5">
              <tr *ngFor="let p of paginatedPaintings" class="hover:bg-white/[0.02] transition-colors group">
                <td class="px-6 py-6 font-mono text-neutral-400">#{{ p.id }}</td>
                <td class="px-6 py-6 font-serif text-white text-sm tracking-normal italic">{{ p.title }}</td>
                <td class="px-6 py-6 text-neutral-300">{{ p.artist }}</td>
                <td class="px-6 py-6 text-[#c6a664] font-bold">{{ p.price }}</td>
                <td class="px-6 py-6">
                  <span [class]="p.availability ? 'text-green-400' : 'text-red-400'">
                    {{ p.availability ? 'Available' : 'Reserved' }}
                  </span>
                </td>
                <td class="px-6 py-6 text-right space-x-4">
                  <button (click)="openEditModal(p)" class="text-[#c6a664]/60 hover:text-[#c6a664] transition-colors font-bold">Edit</button>
                  <button (click)="deletePainting(p.id)" class="text-red-500/60 hover:text-red-500 transition-colors font-bold">Deaccession</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Controls -->
        <div class="flex justify-between items-center p-6 border-t border-[#c6a664]/10 bg-[#c6a664]/[0.02]">
          <span class="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">
             Displaying {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, paintings().length) }} of {{ paintings().length }} Assets
          </span>
          <div class="flex items-center space-x-6">
             <button 
               (click)="prevPage()" 
               [disabled]="currentPage === 1"
               class="text-[10px] uppercase tracking-widest text-[#c6a664]/60 hover:text-[#c6a664] disabled:opacity-30 disabled:hover:text-[#c6a664]/60 transition-colors font-bold"
             >
               Previous
             </button>
             <span class="text-[10px] uppercase tracking-widest text-neutral-300 font-bold">
               Page {{ currentPage }} / {{ totalPages }}
             </span>
             <button 
               (click)="nextPage()" 
               [disabled]="currentPage === totalPages"
               class="text-[10px] uppercase tracking-widest text-[#c6a664]/60 hover:text-[#c6a664] disabled:opacity-30 disabled:hover:text-[#c6a664]/60 transition-colors font-bold"
             >
               Next
             </button>
          </div>
        </div>
      </div>

      <!-- Simple Modal (Hidden by default) -->
      <div *ngIf="isModalOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
        <div class="bg-[#0a0a0a] border border-[#c6a664]/20 p-12 w-full max-w-2xl relative shadow-2xl">
           <button (click)="closeModal()" class="absolute top-6 right-6 text-[#c6a664]/40 hover:text-[#c6a664] transition-colors">✕</button>
           
           <h3 class="font-serif text-2xl text-[#c6a664] mb-8 italic">{{ editMode ? 'Modify Record' : 'Catalog New Artwork' }}</h3>
           
           <form (submit)="savePainting()" class="grid grid-cols-2 gap-8">
             <div class="space-y-4">
               <div>
                 <label class="block text-[9px] text-[#c6a664] uppercase tracking-widest mb-1 font-bold">Title</label>
                 <input [(ngModel)]="currentPainting.title" name="title" class="w-full bg-black/40 border border-[#c6a664]/10 p-3 text-neutral-200 focus:outline-none focus:border-[#c6a664]/40 transition-all font-sans">
               </div>
               <div>
                 <label class="block text-[9px] text-[#c6a664] uppercase tracking-widest mb-1 font-bold">Artist</label>
                 <input [(ngModel)]="currentPainting.artist" name="artist" class="w-full bg-black/40 border border-[#c6a664]/10 p-3 text-neutral-200 focus:outline-none focus:border-[#c6a664]/40 transition-all font-sans">
               </div>
               <div>
                 <label class="block text-[9px] text-[#c6a664] uppercase tracking-widest mb-1 font-bold">Price</label>
                 <input [(ngModel)]="currentPainting.price" name="price" class="w-full bg-black/40 border border-[#c6a664]/10 p-3 text-neutral-200 focus:outline-none focus:border-[#c6a664]/40 transition-all font-sans">
               </div>
             </div>
             <div class="space-y-4">
               <div>
                 <label class="block text-[9px] text-[#c6a664] uppercase tracking-widest mb-1 font-bold">Image Path</label>
                 <input [(ngModel)]="currentPainting.image" name="image" class="w-full bg-black/40 border border-[#c6a664]/10 p-3 text-neutral-200 focus:outline-none focus:border-[#c6a664]/40 transition-all font-sans">
               </div>
               <div>
                 <label class="block text-[9px] text-[#c6a664] uppercase tracking-widest mb-1 font-bold">Category</label>
                 <input [(ngModel)]="currentPainting.category" name="category" class="w-full bg-black/40 border border-[#c6a664]/10 p-3 text-neutral-200 focus:outline-none focus:border-[#c6a664]/40 transition-all font-sans">
               </div>
               <div>
                 <label class="block text-[9px] text-[#c6a664] uppercase tracking-widest mb-1 font-bold">Availability</label>
                 <select [(ngModel)]="currentPainting.availability" name="availability" class="w-full bg-black/40 border border-[#c6a664]/10 p-3 text-neutral-200 focus:outline-none focus:border-[#c6a664]/40 transition-all font-sans">
                   <option [ngValue]="1">Available</option>
                   <option [ngValue]="0">Reserved</option>
                 </select>
               </div>
             </div>
             <div class="col-span-2">
               <label class="block text-[9px] text-[#c6a664] uppercase tracking-widest mb-1 font-bold">Description</label>
               <textarea [(ngModel)]="currentPainting.description" name="description" rows="3" class="w-full bg-black/40 border border-[#c6a664]/10 p-3 text-neutral-200 focus:outline-none focus:border-[#c6a664]/40 transition-all font-sans"></textarea>
             </div>
             
             <div class="col-span-2 pt-4">
               <button type="submit" class="w-full py-4 bg-[#c6a664] text-black uppercase tracking-[0.4em] text-[10px] font-bold hover:bg-white transition-all shadow-lg">
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
  private dataService = inject(DataService);
  paintings = this.dataService.paintings;
  isModalOpen = false;
  editMode = false;
  currentPainting: Partial<Painting> = {};

  // Pagination
  currentPage = 1;
  itemsPerPage = 4;
  protected Math = Math;

  constructor() {}

  ngOnInit() {
    this.dataService.getPaintings().subscribe();
  }

  get paginatedPaintings() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.paintings().slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.paintings().length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
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
        this.closeModal();
      }
    });
  }

  deletePainting(id: number) {
    if (confirm('Are you sure you want to deaccession this artwork?')) {
      this.dataService.deletePainting(id).subscribe();
    }
  }
}
