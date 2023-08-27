import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros';
  private authorId = 3;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<any> {
    let url = this.baseUrl + '/bp/products';
    const headers = new HttpHeaders().set('authorId', this.authorId.toString());
    return this.http.get(url, { headers });
  }

  createProduct(): Observable<any> {
    let url = this.baseUrl + '/bp/products';
    const headers = new HttpHeaders().set('authorId', this.authorId.toString());
    return this.http.post(url, {}, { headers });
  }

}
