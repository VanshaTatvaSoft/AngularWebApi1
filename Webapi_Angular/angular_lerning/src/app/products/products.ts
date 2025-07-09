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
  styleUrl: './products.css',
})
export class Products implements OnInit {
  products: any[] = [];
  columns = [
    { key: 'productname', header: 'Name' },
    { key: 'productdesc', header: 'Description' },
    { key: 'productprice', header: 'Price' },
    { key: 'productquantity', header: 'Quantity' },
  ];
  addComponent = AddProduct;
  pageNumber: number = 1;
  pageSize: number = 5;
  totalCount: number = 0;
  searchText: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(searchText: string = ''): void {
    this.productService.getProducts(this.pageNumber , this.pageSize, this.searchText).subscribe({
      next: (res) => {
        console.log(res);
        console.log(res);
        if (res.status) {
          this.products = res.products;
          this.totalCount = res.totalCount;
        }
      },
      error: () => alert('Failed to load products.'),
    });
  }

  onSearch(searchText: string): void {
    this.pageNumber = 1;
    this.searchText = searchText;
    this.loadProducts();
  }

  onPageChange(event: any): void{
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }
}
