import { Component, Input, Output, EventEmitter, forwardRef, signal, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

export interface SelectOption {
  label: string;
  value: any;
}

@Component({
  selector: 'app-luxury-select',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LuxurySelectComponent),
      multi: true
    }
  ],
  animations: [
    trigger('dropdownAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px) scale(0.95)' }),
        animate('150ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ]),
      transition(':leave', [
        animate('100ms ease-in', style({ opacity: 0, transform: 'translateY(-10px) scale(0.95)' }))
      ])
    ])
  ],
  template: `
    <div class="relative w-full font-sans text-sm" [class.opacity-60]="disabled" (click)="toggleDropdown($event)">
      
      <!-- Label if provided -->
      <label *ngIf="label" class="block text-[11px] uppercase tracking-[0.4em] text-[#c6a664] mb-3 font-['Cinzel'] font-bold drop-shadow-sm">
        {{ label }}
      </label>

      <!-- Main Select Box -->
      <div 
        class="relative w-full bg-[#0a0a0a] border-2 cursor-pointer flex items-center justify-between px-5 py-4 rounded-sm transition-all duration-500 group shadow-md"
        [class.border-[#c6a664]/30]="!isOpen && !error"
        [class.border-[#c6a664]]="isOpen && !error"
        [class.border-red-500/60]="error"
        [class.shadow-[0_0_20px_rgba(198,166,100,0.2)]]="isOpen"
      >
        <!-- Background subtle glow on hover -->
        <div class="absolute inset-0 bg-[#c6a664]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

        <!-- Selected Value Display -->
        <span class="relative z-10 truncate font-medium tracking-wide" 
              [class.text-neutral-400]="!value" 
              [class.text-white]="value">
          {{ getDisplayLabel() }}
        </span>

        <!-- Arrow Icon -->
        <div class="relative z-10 text-[#c6a664] transition-transform duration-500" [class.rotate-180]="isOpen">
          <svg width="12" height="8" viewBox="0 0 10 6" fill="none">
            <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <!-- Dropdown Menu -->
      <div *ngIf="isOpen" 
           [@dropdownAnimation]
           class="absolute top-full left-0 w-full mt-3 bg-[#0a0a0a] backdrop-blur-2xl border-2 border-[#c6a664]/40 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,1)] z-50 overflow-hidden max-h-72 overflow-y-auto custom-scrollbar">
        
        <div *ngFor="let option of options" 
             (click)="selectOption(option, $event)"
             class="relative px-5 py-4 cursor-pointer group transition-all duration-300 border-b border-[#c6a664]/10 last:border-0"
             [class.bg-[#c6a664]/10]="value === option.value">
          
          <div class="flex items-center justify-between">
            <span class="text-[11px] uppercase tracking-[0.2em] font-bold transition-colors duration-300"
                  [class.text-[#c6a664]]="value === option.value"
                  [class.text-neutral-300]="value !== option.value"
                  [class.group-hover:text-white]="value !== option.value">
              {{ option.label }}
            </span>
            
            <!-- Checkmark for selected -->
            <svg *ngIf="value === option.value" width="12" height="10" viewBox="0 0 12 10" fill="none" class="text-[#c6a664] drop-shadow-[0_0_5px_rgba(198,166,100,0.5)]">
              <path d="M1 5L4.5 8.5L11 1" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          
          <!-- Hover Highlight Line -->
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-[#c6a664] transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
        </div>
      </div>
      
      <!-- Error Message -->
      <div *ngIf="error" class="mt-2 text-[10px] text-red-400 font-bold uppercase tracking-widest flex items-center drop-shadow-sm">
         <span class="w-1.5 h-1.5 bg-red-500 rounded-full mr-2 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></span>
         {{ error }}
      </div>

    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(198,166,100,0.05);
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(198,166,100,0.2);
      border-radius: 2px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(198,166,100,0.4);
    }
  `]
})
export class LuxurySelectComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = 'Select...';
  @Input() options: SelectOption[] = [];
  @Input() error: string | null = null;
  @Input() disabled: boolean = false;

  value: any = null;
  isOpen: boolean = false;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.onTouched();
    }
  }

  toggleDropdown(event: Event) {
    if (this.disabled) return;
    event.stopPropagation();
    this.isOpen = !this.isOpen;
    if (!this.isOpen) this.onTouched();
  }

  selectOption(option: SelectOption, event: Event) {
    event.stopPropagation();
    this.value = option.value;
    this.onChange(this.value);
    this.isOpen = false;
  }

  getDisplayLabel(): string {
    const selected = this.options.find(o => o.value === this.value);
    return selected ? selected.label : this.placeholder;
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
