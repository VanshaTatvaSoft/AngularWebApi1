import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductResponse } from '../models/ProductResponse';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // private apiUrl = 'http://localhost:5131/api/Product';
  private apiUrl = `${environment.apiBaseUrl}/Product`;
  constructor(private http: HttpClient) {}

  getProducts(pageNumber= 1 , pageSize = 5 ,searchCriteria: string | null = "", minPrice = 0, maxPrice = 2147483647): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/products`,
      {
        params: {
        pageNumber: pageNumber.toString() ,
        pageSize : pageSize.toString(),
        searchCriteria : searchCriteria ?? "",
        minPrice: minPrice.toString(),
        maxPrice: maxPrice.toString(),
      }
    });
  }

  addProduct(product: any) {
    const formData = new FormData();
    formData.append('Productname', product.productname);
    formData.append('Productdesc', product.productdesc);
    formData.append('Productprice', product.productprice.toString());
    formData.append('Productquantity', product.productquantity.toString());
    return this.http.post<any>(`${this.apiUrl}/products`, formData);
  }

  updateProduct(product: any) {
    const formData = new FormData();
    formData.append('Id', product.id);
    formData.append('Productname', product.productname);
    formData.append('Productdesc', product.productdesc);
    formData.append('Productprice', product.productprice.toString());
    formData.append('Productquantity', product.productquantity.toString());
    return this.http.put<any>(`${this.apiUrl}/products`, formData);
  }
}
