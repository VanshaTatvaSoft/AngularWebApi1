import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ProductService } from './services/product';
import { CommonModule } from '@angular/common';
import { GenericList } from '../shared/components/generic-list/generic-list';
import { AddProduct } from './add-product/add-product';
import { catchError, map, Observable, of } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { GenericDialog } from '../shared/components/generic-dialog/generic-dialog';
import { FormatCurrencyCompactPipePipe } from '../shared/pipe/format-currency-compact-pipe-pipe';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, GenericList, MatCardModule, MatButtonModule, FormatCurrencyCompactPipePipe],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  products: any[] = [];
  // products!: Observable<any[]>;
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
  minPrice: number = 0;
  maxPrice: number = 2147483647;
  isLoading = false;
  allLoaded = false;

  constructor(private productService: ProductService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // @HostListener('window:scroll', [])
  // onScroll(): void {
  //   console.log("Scroll");
  //   const bottomReached = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 100);
  //   if (bottomReached) {
  //     this.pageNumber++;
  //     this.loadProducts();
  //   }
  // }

  // @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  // onScroll(): void {
  //   const el = this.scrollContainer.nativeElement;
  //   const bottomReached =
  //     el.scrollTop + el.clientHeight >= el.scrollHeight - 100;

  //   if (bottomReached && !this.allLoaded) {
  //     console.log('Scrolled to bottom → Loading more...');
  //     this.pageNumber++;
  //     this.loadProducts();
  //   }
  // }

  // loadMoreClicked(): void{
  //   if(!this.allLoaded){
  //     this.pageNumber++;
  //     this.loadProducts();
  //   }
  // }

  loadProducts(searchText: string = ''): void {
    this.productService
      .getProducts(this.pageNumber, this.pageSize, this.searchText, this.minPrice, this.maxPrice)
      .subscribe({
        next: (res) => {
          console.log(res);
          if (res.status) {
            this.products = res.products;
            // this.products = [...this.products, ...res.products];
            this.totalCount = res.totalCount;
            if (this.products.length >= res.totalCount) {
              this.allLoaded = true;
            }
          }
        },
        error: () => alert('Failed to load products.'),
      });

    // this.products = this.productService
    //   .getProducts(this.pageNumber, this.pageSize, this.searchText)
    //   .pipe(
    //     map((res) => {
    //       // this.products = res.products;
    //       this.totalCount = res.totalCount;
    //       return res.products
    //     }),
    //     catchError(() => {
    //       alert('Failed to load products.');
    //       return of([]);
    //     })
    //   );
  }

  onEditClicked(product: any): void{
    const dialogRef = this.dialog.open(GenericDialog, {
      width: '500px',
      data: {
        component: this.addComponent,
        formData: product,
      },
    });

    dialogRef.afterClosed().subscribe((shouldRefresh: boolean) => {
      if (shouldRefresh) {
        this.loadProducts();
      }
    });
  }

  onSearch(searchText: string): void {
    this.pageNumber = 1;
    this.searchText = searchText;
    this.loadProducts();
  }

  onPageChange(event: any): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }

  onPriceFilter(priceRange: { min: number; max: number }): void {
    this.pageNumber = 1;
    this.minPrice = priceRange.min;
    this.maxPrice = priceRange.max;
    this.loadProducts();
  }

}
