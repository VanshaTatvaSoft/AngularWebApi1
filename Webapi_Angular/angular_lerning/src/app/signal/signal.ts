import { ChangeDetectorRef, Component, computed, inject, signal } from '@angular/core';
import { Product } from './model/Product';
import { Products } from './products/products';
import { Cart } from './cart/cart';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Storage } from '../shared/services/storage';

@Component({
  selector: 'app-signal',
  standalone: true,
  imports: [Products, Cart, CommonModule, FormsModule, TranslateModule],
  templateUrl: './signal.html',
  styleUrl: './signal.css'
})

export class Signal {
  private translate = inject(TranslateService);
  lang = 'en';

  constructor(private storage: Storage, private cd: ChangeDetectorRef) {
    const storedLang = this.storage.getItem('lang') || 'en';
    this.lang = storedLang || 'en';
    this.translate.use(this.lang);
  }

  switchLang(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
    this.cd.detectChanges();
  }

  private initialProducts: Product[] = [
    { id: 1, name: 'Laptop', price: 80000 },
    { id: 2, name: 'Phone', price: 30000 },
    { id: 3, name: 'Tablet', price: 20000 },
  ];

  products = signal<Product[]>(this.initialProducts);
  cart = signal<Product[]>([]);

  cartTotal = computed(() =>
    this.cart().reduce((total, item) => total + item.price, 0)
  );

  addToCart(product: Product) {
    const currentCart = this.cart();
    this.cart.set([...currentCart, product]);
  }

  removeFromCart(productId: number) {
    this.cart.update(cart => cart.filter(p => p.id !== productId));
  }
}
