import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GenericButtonConfig } from '../../../auth/models/GenericButtonInterface';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-generic-button',
  imports: [MatButtonModule, CommonModule, MatIconModule, MatTooltipModule],
  templateUrl: './generic-button.html',
  styleUrl: './generic-button.css'
})
export class GenericButton {
  @Input() config!: GenericButtonConfig;
  @Output() onClick = new EventEmitter<MouseEvent>();

  handleClick(event: MouseEvent) {
    if (!this.config.disabled) {
      this.onClick.emit(event);
    }
  }
}
