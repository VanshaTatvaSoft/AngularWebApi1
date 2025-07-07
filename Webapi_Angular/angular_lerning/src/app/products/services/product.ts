import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductResponse } from '../models/ProductResponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:5131/api/Product';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/products`);
  }

  addProduct(product: any) {
    const formData = new FormData();
    formData.append('Productname', product.productname);
    formData.append('Productdesc', product.productdesc);
    formData.append('Productprice', product.productprice.toString());
    formData.append('Productquantity', product.productquantity.toString());
    return this.http.post<any>(
      `${this.apiUrl}/products`,
      formData
    );
  }
}
