import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../../enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  ProductAddress: string = environment.apiRoot + '/bp/products';

  constructor(private _http: HttpClient) {}
  getAll(): Observable<{ data: Product[] }> {
    return this._http.get(`${this.ProductAddress}`) as Observable<{
      data: Product[];
    }>;
  }

  getProductId(id: string): Observable<Product> {
    return this._http.get(
      `${this.ProductAddress}/${id}`
    ) as Observable<Product>;
  }

  getProductIdVerify(id: string): Observable<boolean> {
    return this._http.get(
      `${this.ProductAddress}/verification/${id}`
    ) as Observable<boolean>;
  }

  postProduct(
    Product: Product
  ): Observable<{ message: string; data: Product }> {
    return this._http.post(this.ProductAddress, Product) as Observable<{
      message: string;
      data: Product;
    }>;
  }

  putProduct(
    id: string,
    Product: Product
  ): Observable<{ message: string; data: Product }> {
    return this._http.put(
      `${this.ProductAddress}/${id}`,
      Product
    ) as Observable<{ message: string; data: Product }>;
  }
  deleteProduct(id: string): Observable<{ message: string }> {
    return this._http.delete(`${this.ProductAddress}/${id}`) as Observable<{
      message: string;
    }>;
  }
}
