import { Component, inject } from '@angular/core';
import { Signal } from '../signal';
import { CommonModule } from '@angular/common';
import { FormatCurrencyCompactPipePipe } from '../../shared/pipe/format-currency-compact-pipe-pipe';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormatCurrencyCompactPipePipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {
  signalService = inject(Signal);

  remove(id: number) {
    this.signalService.removeFromCart(id);
  }
}
