import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros';
  private authorId = 3;

  isCreating: boolean = false;
  isUpdating: boolean = false;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<any> {
    let url = this.baseUrl + '/bp/products';
    const headers = new HttpHeaders().set('authorId', this.authorId.toString());
    return this.http.get(url, { headers });
  }

  createProduct(product: any): Observable<any> {
    let url = this.baseUrl + '/bp/products';
    const headers = new HttpHeaders().set('authorId', this.authorId.toString());
    return this.http.post(url, product, { headers });
  }

  updateProduct(productId: number, updatedProduct: any): Observable<any> {
    let url = `${this.baseUrl}/bp/products?id=${productId}`;
    const headers = new HttpHeaders().set('authorId', this.authorId.toString());
    return this.http.put(url, updatedProduct, { headers });
  }

  deleteProduct(productId: number): Observable<any> {
    let url = `${this.baseUrl}/bp/products?id=${productId}`;
    const headers = new HttpHeaders().set('authorId', this.authorId.toString());
    return this.http.delete(url, { headers, responseType: 'text' }).pipe(
      catchError((error: any) => {
        return throwError(() => error);
      })
    );
  }

  verifyProductExists(productId: number): Observable<any> {
    let url = `${this.baseUrl}/bp/products/verification?id=${productId}`;
    const headers = new HttpHeaders().set('authorId', this.authorId.toString());
    return this.http.get(url, { headers });
  }

}
