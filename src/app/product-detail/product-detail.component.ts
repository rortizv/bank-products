import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  productForm!: FormGroup;
  dateDisabled: boolean = true;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildProductForm();
  }

  buildProductForm() {
    this.productForm = this.formBuilder.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: [{ value: '', disabled: true }, Validators.required],
    });

    // Subscribe to date_release value changes
    this.productForm.get('date_release')?.valueChanges.subscribe(value => {
      if (value) {
        const releaseDate = new Date(value);
        releaseDate.setFullYear(releaseDate.getFullYear() + 1);

        this.productForm.get('date_revision')?.setValue(releaseDate.toISOString().split('T')[0]);
      }
    });
  }

  createProduct() {
    this.submitted = true;
    if (!this.productForm.invalid) {
      const productData = this.productForm.value;

      this.productService.createProduct(productData)
        .pipe(
          catchError(error => {
            console.log('Error creating product:', error);
            return of(null); // Return a safe observable in case of error
          })
        )
        .subscribe(response => {
          if (response) {
            alert('Product created successfully');
            this.router.navigate(['']);
            console.log('Product created:', response);
          } else {
            console.log('Product creation failed');
          }
        });
    }
  }

  resetForm() {
    this.productForm.reset();
  }

  cancel() {
    this.resetForm();
    this.router.navigate(['']);
  }

  markFormControlAsTouched(controlName: string) {
    const control = this.productForm.get(controlName);
    if (control) {
      control.markAsTouched();
    }
  }

}
