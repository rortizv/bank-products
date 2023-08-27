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
    this.productService.isCreating = true;
    this.router.navigate(['/product']);
  }

  fireAction(event: Event, productId: number) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (selectedValue === 'delete') {
      this.deleteProduct(productId);
    } else if (selectedValue === 'update') {
      const selectedProduct = this.productsFiltered.find(product => product.id === productId);
      console.log('Selected product:', selectedProduct);
      this.router.navigate(['/product'], { state: { product: selectedProduct } });
    }
  }

  deleteProduct(productId: number): void {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productService.deleteProduct(productId).subscribe(
        (response: any) => {
          console.log('Product deleted:', response);
          if (response === "Product successfully removed") {
            alert('Producto eliminado correctamente');
            // Refresh the product list after deletion
            this.getProductsList();
          }
        },
        (error) => {
          console.error('Error deleting product:', error);
        }
      );
    }
  }

}
