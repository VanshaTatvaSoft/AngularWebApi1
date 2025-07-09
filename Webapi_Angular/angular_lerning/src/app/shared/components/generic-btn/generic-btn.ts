import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-generic-btn',
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './generic-btn.html',
  styleUrl: './generic-btn.css'
})
export class GenericBtn {
  @Input() label?: string;
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() icon?: string;
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' = 'button';
  @Input() variant: 'mat-flat-button' | 'mat-raised-button' | 'mat-stroked-button' | 'mat-button' = 'mat-raised-button';
  @Input() matBtnType: 'elevated' | 'outlined' | 'filled' | 'tonal' = 'elevated';

  @Output() clicked = new EventEmitter<void>();

  onClick() {
    if (!this.disabled) this.clicked.emit();
  }

}
