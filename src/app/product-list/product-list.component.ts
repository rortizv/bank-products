import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  searchTerm: string = '';
  productsFiltered: any[] = [];

  constructor(private productService: ProductService,
              private router: Router) { }

  ngOnInit(): void {
    this.getProductsList();
  }

  getProductsList(): void {
    this.productService.getProducts().subscribe(
      (response: any) => {
        this.products = response;
        this.productsFiltered = [...this.products];
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  filterProducts(): void {
    this.productsFiltered = this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  createProduct(): void {
    this.router.navigate(['/product']);
  }

}
