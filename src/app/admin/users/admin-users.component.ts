import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, User } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-12 animate-in fade-in duration-700">
      <header class="flex justify-between items-end">
        <div>
          <h2 class="font-serif text-4xl text-gold tracking-wide italic">Executive Registry</h2>
          <p class="font-sans text-[10px] text-neutral-500 uppercase tracking-[0.4em] mt-2">Access Control • Victoria Personnel</p>
        </div>
        <button 
          (click)="openAddModal()"
          class="px-8 py-3 border border-gold/20 text-gold text-[10px] uppercase tracking-[0.3em] hover:bg-gold hover:text-black transition-all duration-500"
        >
          Enlist New Representative
        </button>
      </header>

      <!-- Users Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div *ngFor="let u of users" class="border border-gold/10 bg-black/40 backdrop-blur-sm p-8 relative group">
          <div class="flex justify-between items-start mb-6">
            <div class="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center font-serif text-gold text-xl italic bg-gold/5">
              {{ u.username[0] | uppercase }}
            </div>
            <span [class]="u.status === 'active' ? 'text-green-500/60' : 'text-red-500/60'" class="text-[8px] uppercase tracking-[0.3em]">
              {{ u.status }}
            </span>
          </div>
          
          <h3 class="font-serif text-xl text-neutral-200 tracking-wide mb-2 italic">{{ u.username }}</h3>
          <p class="text-[9px] text-gold/40 uppercase tracking-[0.4em] mb-8">{{ u.role }} Identifier</p>
          
          <div class="flex justify-between items-center pt-6 border-t border-gold/5">
            <button (click)="openEditModal(u)" class="text-[10px] text-neutral-500 hover:text-gold uppercase tracking-widest transition-colors">Modify Access</button>
            <button 
              *ngIf="u.username !== authService.currentUser()?.username"
              (click)="deleteUser(u.id)" 
              class="text-[10px] text-red-900/40 hover:text-red-500 uppercase tracking-widest transition-colors"
            >
              revoke
            </button>
          </div>
        </div>
      </div>

      <!-- User Modal -->
      <div *ngIf="isModalOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
        <div class="bg-[#0a0a0a] border border-gold/20 p-12 w-full max-w-md relative shadow-2xl">
           <button (click)="closeModal()" class="absolute top-6 right-6 text-gold/40 hover:text-gold transition-colors">✕</button>
           
           <h3 class="font-serif text-2xl text-gold mb-10 italic">{{ editMode ? 'Modify Security Profile' : 'Grant New Access' }}</h3>
           
           <form (submit)="saveUser()" class="space-y-8">
             <div>
               <label class="block text-[8px] text-gold/40 uppercase tracking-widest mb-2">Subject Name</label>
               <input [(ngModel)]="currentUser.username" name="username" class="w-full bg-black/40 border-b border-gold/10 py-3 text-neutral-100 focus:outline-none focus:border-gold/50 transition-all font-sans text-sm">
             </div>
             
             <div *ngIf="!editMode || showPassword">
               <label class="block text-[8px] text-gold/40 uppercase tracking-widest mb-2">Verification Key</label>
               <input type="password" [(ngModel)]="currentUser.password" name="password" class="w-full bg-black/40 border-b border-gold/10 py-3 text-neutral-100 focus:outline-none focus:border-gold/50 transition-all font-sans text-sm">
             </div>

             <div class="grid grid-cols-2 gap-8">
               <div>
                 <label class="block text-[8px] text-gold/40 uppercase tracking-widest mb-4">Security Level</label>
                 <select [(ngModel)]="currentUser.role" name="role" class="w-full bg-transparent border-b border-gold/10 py-2 text-gold/60 focus:outline-none text-[10px] uppercase tracking-widest cursor-pointer">
                   <option value="admin">Executive (Admin)</option>
                   <option value="user">Collector (User)</option>
                 </select>
               </div>
               <div>
                 <label class="block text-[8px] text-gold/40 uppercase tracking-widest mb-4">Account Status</label>
                 <select [(ngModel)]="currentUser.status" name="status" class="w-full bg-transparent border-b border-gold/10 py-2 text-gold/60 focus:outline-none text-[10px] uppercase tracking-widest cursor-pointer">
                   <option value="active">Active</option>
                   <option value="disabled">Suspended</option>
                 </select>
               </div>
             </div>
             
             <div class="pt-8">
               <button type="submit" class="w-full py-5 border border-gold/30 text-gold uppercase tracking-[0.5em] text-[10px] hover:bg-gold hover:text-black transition-all">
                 Validate Credentials
               </button>
             </div>
           </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  isModalOpen = false;
  editMode = false;
  showPassword = false;
  currentUser: Partial<User> = {};

  constructor(private dataService: DataService, public authService: AuthService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.dataService.getUsers().subscribe(data => this.users = data);
  }

  openAddModal() {
    this.editMode = false;
    this.showPassword = true;
    this.currentUser = { role: 'user', status: 'active' };
    this.isModalOpen = true;
  }

  openEditModal(u: User) {
    this.editMode = true;
    this.showPassword = false;
    this.currentUser = { ...u };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveUser() {
    const action = this.editMode 
      ? this.dataService.updateUser(this.currentUser.id!, this.currentUser)
      : this.dataService.createUser(this.currentUser);

    (action as any).subscribe({
      next: () => {
        this.loadUsers();
        this.closeModal();
      },
      error: (err: any) => {
        alert(err.error.message || 'Error occurred');
      }
    });
  }

  deleteUser(id: number) {
    if (confirm('Revoke all access for this representative?')) {
      this.dataService.deleteUser(id).subscribe(() => this.loadUsers());
    }
  }
}
