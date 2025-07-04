import { Component, OnInit } from '@angular/core';
import { ProductService } from './services/product';
import { CommonModule } from '@angular/common';
import { GenericList } from '../shared/components/generic-list/generic-list';
import { AddProduct } from './add-product/add-product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, GenericList],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {
  products: any[] = [];
  columns = [
    { key: 'productname', header: 'Name' },
    { key: 'productdesc', header: 'Description' },
    { key: 'productprice', header: 'Price' },
    { key: 'productquantity', header: 'Quantity' }
  ];
  addComponent = AddProduct;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (res) => {
        console.log(res);
        console.log(res);
        if (res.status) {
          this.products = res.products;
        }
      },
      error: () => alert('Failed to load products.')
    });
  }

}
