import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, User } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { LuxurySelectComponent } from '../../components/ui/luxury-select/luxury-select.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, LuxurySelectComponent],
  template: `
    <div class="space-y-12 animate-in fade-in duration-700">
      <header class="flex justify-between items-end">
        <div>
          <h2 class="font-serif text-4xl text-[#c6a664] tracking-wide italic drop-shadow-md">Executive Registry</h2>
          <p class="font-sans text-[11px] text-neutral-400 uppercase tracking-[0.4em] mt-2 font-medium">Access Control • Victoria Personnel</p>
        </div>
        <button 
          (click)="openAddModal()"
          class="px-8 py-3 border border-[#c6a664]/20 text-[#c6a664] text-[10px] uppercase tracking-[0.3em] hover:bg-[#c6a664] hover:text-black transition-all duration-500 font-bold"
        >
          Enlist New Representative
        </button>
      </header>

      <!-- Users Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div *ngFor="let u of users()" class="border border-[#c6a664]/10 bg-black/40 backdrop-blur-sm p-8 relative group transition-colors hover:border-[#c6a664]/30">
          <div class="flex justify-between items-start mb-6">
            <div class="w-12 h-12 rounded-full border border-[#c6a664]/20 flex items-center justify-center font-serif text-[#c6a664] text-xl italic bg-[#c6a664]/5">
              {{ u.username[0] | uppercase }}
            </div>
            <span [class]="u.status === 'active' ? 'text-green-400' : 'text-red-400'" class="text-[9px] uppercase tracking-[0.3em] font-bold">
              {{ u.status }}
            </span>
          </div>
          
          <h3 class="font-serif text-xl text-white tracking-wide mb-2 italic drop-shadow-sm">{{ u.username }}</h3>
          <p class="text-[10px] text-[#c6a664] uppercase tracking-[0.4em] mb-8 font-bold">{{ u.role }} Identifier</p>
          
          <div class="flex justify-between items-center pt-6 border-t border-[#c6a664]/10">
            <button (click)="openEditModal(u)" class="text-[10px] text-neutral-400 hover:text-[#c6a664] uppercase tracking-widest transition-colors font-bold">Modify Access</button>
            <button 
              *ngIf="u.username !== authService.currentUser()?.username"
              (click)="deleteUser(u.id)" 
              class="text-[10px] text-red-500/60 hover:text-red-500 uppercase tracking-widest transition-colors font-bold"
            >
              revoke
            </button>
          </div>
        </div>
      </div>

      <!-- User Modal -->
      <!-- User Modal (Landscape) -->
      <div *ngIf="isModalOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
        <div class="bg-[#0a0a0a] border border-[#c6a664]/20 p-12 w-full max-w-5xl relative shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
           <button (click)="closeModal()" class="fixed top-8 right-12 z-[210] text-[#c6a664]/40 hover:text-[#c6a664] transition-colors text-xl p-4">✕</button>
           
           <h3 class="font-serif text-3xl text-[#c6a664] mb-12 italic border-b border-[#c6a664]/10 pb-6">{{ editMode ? 'Modify Security Profile' : 'Grant New Access' }}</h3>
           
           <form (submit)="saveUser()" class="space-y-12">
             
             <!-- Landscape Layout Grid -->
             <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                <!-- Left Column: Identity -->
                <div class="space-y-8">
                  <div>
                    <label class="block text-[9px] text-[#c6a664] uppercase tracking-widest mb-3 font-bold">Subject Name</label>
                    <input [(ngModel)]="currentUser.username" name="username" class="w-full bg-black/40 border-b border-[#c6a664]/10 py-3 text-white focus:outline-none focus:border-[#c6a664]/50 transition-all font-sans text-sm font-medium">
                  </div>
                  
                  <div *ngIf="!editMode || showPassword">
                    <label class="block text-[9px] text-[#c6a664] uppercase tracking-widest mb-3 font-bold">Verification Key</label>
                    <input type="password" [(ngModel)]="currentUser.password" name="password" class="w-full bg-black/40 border-b border-[#c6a664]/10 py-3 text-white focus:outline-none focus:border-[#c6a664]/50 transition-all font-sans text-sm font-medium">
                  </div>

                  <div class="grid grid-cols-2 gap-6 pt-4">
                    <app-luxury-select
                       label="Security Level"
                       [(ngModel)]="currentUser.role"
                       name="role"
                       [options]="[
                         {label: 'Executive (Admin)', value: 'admin'},
                         {label: 'Collector (User)', value: 'user'}
                       ]"
                     ></app-luxury-select>

                     <app-luxury-select
                       label="Account Status"
                       [(ngModel)]="currentUser.status"
                       name="status"
                       [options]="[
                         {label: 'Active', value: 'active'},
                         {label: 'Suspended', value: 'disabled'}
                       ]"
                     ></app-luxury-select>
                  </div>
                </div>

                <!-- Right Column: Security (Edit Mode Only) or Info -->
                <div class="relative">
                   <!-- Vertical Divider (Desktop) -->
                   <div class="absolute left-[-24px] top-0 bottom-0 w-px bg-[#c6a664]/5 hidden md:block"></div>

                   <!-- CHANGE PASSWORD SECTION -->
                   <div *ngIf="editMode" class="pl-0 md:pl-6 animate-in fade-in duration-500 h-full flex flex-col justify-center">
                     <div class="flex items-center space-x-4 mb-8">
                       <h4 class="font-serif text-xl text-[#c6a664] italic">Security Key Rotation</h4>
                       <div class="flex-1 h-px bg-[#c6a664]/10"></div>
                     </div>

                     <div class="space-y-6">
                       <div class="grid grid-cols-2 gap-6">
                         <div>
                           <label class="block text-[9px] text-[#c6a664] uppercase tracking-widest mb-2 font-bold">New Key</label>
                           <input type="password" [(ngModel)]="newPassword" name="newPassword" 
                                  class="w-full bg-black/40 border-b border-[#c6a664]/10 py-2 text-white focus:outline-none focus:border-[#c6a664]/50 transition-all font-sans text-sm placeholder-[#c6a664]/20 font-medium"
                                  placeholder="••••••">
                         </div>
                         <div>
                            <label class="block text-[9px] text-[#c6a664] uppercase tracking-widest mb-2 font-bold">Confirm</label>
                            <input type="password" [(ngModel)]="confirmPassword" name="confirmPassword" 
                                   class="w-full bg-black/40 border-b border-[#c6a664]/10 py-2 text-white focus:outline-none focus:border-[#c6a664]/50 transition-all font-sans text-sm placeholder-[#c6a664]/20 font-medium"
                                   placeholder="••••••">
                         </div>
                       </div>

                       <!-- Password Strength -->
                       <div *ngIf="newPassword" class="space-y-2">
                         <div class="flex justify-between text-[9px] text-[#c6a664]/80 uppercase tracking-widest font-bold">
                           <span>Signal Strength</span>
                           <span>{{ newPassword.length < 6 ? 'Weak' : newPassword.length < 10 ? 'Medium' : 'Strong' }}</span>
                         </div>
                         <div class="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                           <div class="h-full bg-[#c6a664] transition-all duration-500" 
                                [style.width]="getPasswordStrength()"></div>
                         </div>
                       </div>
                       
                       <!-- Validation Msg -->
                       <div *ngIf="newPassword && newPassword !== confirmPassword" class="text-[9px] text-red-400 font-light tracking-wide flex items-center animate-pulse">
                          <span class="w-1 h-1 bg-red-400 rounded-full mr-2"></span> Mismatch
                       </div>

                       <div class="mt-4 flex justify-end">
                         <button type="button" 
                                 (click)="updatePassword()"
                                 [disabled]="!isPasswordValid()"
                                 class="px-6 py-3 border border-[#c6a664]/20 text-[9px] uppercase tracking-widest text-[#c6a664] hover:bg-[#c6a664] hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed font-bold">
                           Rotation Protocol
                         </button>
                       </div>
                     </div>
                   </div>

                   <!-- Info Box (Add Mode Only) -->
                   <div *ngIf="!editMode" class="pl-0 md:pl-6 flex items-center justify-center h-full opacity-30 text-center">
                      <div class="space-y-4">
                        <span class="font-serif text-6xl text-[#c6a664] block italic">V</span>
                        <p class="font-sans text-[10px] uppercase tracking-[0.4em] text-white font-bold">Victoria Institution</p>
                        <p class="text-[9px] text-neutral-400 max-w-xs mx-auto">New personnel will be granted immediate Level 3 clearance upon validation.</p>
                      </div>
                   </div>
                </div>
             </div>
             
             <!-- Footer Actions -->
             <div class="pt-8 border-t border-[#c6a664]/10 flex justify-end">
               <button type="submit" class="px-16 py-4 bg-[#c6a664] text-black uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all shadow-[0_0_30px_rgba(198,166,100,0.2)] font-bold">
                 {{ editMode ? 'Save Profile' : 'Validate Entry' }}
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
  private dataService = inject(DataService);
  public authService = inject(AuthService);
  users = this.dataService.users;
  isModalOpen = false;
  editMode = false;
  showPassword = false;
  currentUser: Partial<User> = {};
  newPassword = '';
  confirmPassword = '';

  constructor() {}

  ngOnInit() {
    this.dataService.getUsers().subscribe();
  }

  openAddModal() {
    this.editMode = false;
    this.showPassword = true;
    this.currentUser = { role: 'user', status: 'active' };
    this.resetPasswordFields();
    this.isModalOpen = true;
  }

  openEditModal(u: User) {
    this.editMode = true;
    this.showPassword = false;
    this.currentUser = { ...u };
    this.resetPasswordFields();
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetPasswordFields();
  }

  resetPasswordFields() {
    this.newPassword = '';
    this.confirmPassword = '';
  }

  getPasswordStrength(): string {
    const len = this.newPassword.length;
    if (len === 0) return '0%';
    if (len < 6) return '33%';
    if (len < 10) return '66%';
    return '100%';
  }

  isPasswordValid(): boolean {
    return this.newPassword.length >= 6 && this.newPassword === this.confirmPassword;
  }

  updatePassword() {
    if (!this.currentUser.id) return;
    if (!this.isPasswordValid()) return;

    // Simulate backend call
    // In real app: this.userService.updatePassword(this.currentUser.id, this.newPassword)
    console.log(`Updating password for user ${this.currentUser.id}`);
    
    alert('Security Access Key Updated Successfully');
    this.resetPasswordFields();
  }

  saveUser() {
    const action = this.editMode 
      ? this.dataService.updateUser(this.currentUser.id!, this.currentUser)
      : this.dataService.createUser(this.currentUser);

    (action as any).subscribe({
      next: () => {
        this.closeModal();
      },
      error: (err: any) => {
        alert(err.error.message || 'Error occurred');
      }
    });
  }

  deleteUser(id: number) {
    if (confirm('Revoke all access for this representative?')) {
      this.dataService.deleteUser(id).subscribe();
    }
  }
}
