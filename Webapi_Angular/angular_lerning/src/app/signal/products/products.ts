import { Component, inject } from '@angular/core';
import { Signal } from '../signal';
import { CommonModule } from '@angular/common';
import { FormatCurrencyCompactPipePipe } from '../../shared/pipe/format-currency-compact-pipe-pipe';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormatCurrencyCompactPipePipe],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products {
  signalService = inject(Signal);

  add(product: any) {
    this.signalService.addToCart(product);
  }
}
