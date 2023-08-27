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
  product: any;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildProductForm();
    this.setProductData();
  }

  setProductData() {
    let product = history.state.product;
    this.product = product;

    // Convert the dates string to a Date object
    let dateRelease = new Date(product.date_release);
    let dateRevision = new Date(product.date_revision);
    // Extract the date part and format it as YYYY-MM-DD
    let formattedDateRelease = dateRelease.toISOString().split('T')[0];
    let formattedDateRevision = dateRevision.toISOString().split('T')[0];

    // Create a new product object with the formatted date
    let productWithFormattedDate = {
      ...product,
      date_release: formattedDateRelease,
      date_revision: formattedDateRevision
    };

    // Set the modified product data to the form
    this.productForm.patchValue(productWithFormattedDate);
  }


  buildProductForm() {
    this.productForm = this.formBuilder.group({
      id: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      logo: ['', [Validators.required, Validators.pattern(/^(?:(?:https?|ftp):\/\/|www\.)[^\s/$.?#].[^\s]*$/i)]],
      date_release: ['', Validators.required],
      date_revision: [{ value: '', disabled: true }, Validators.required],
    });

    // Subscribe to date_release value changes
    this.productForm.get('date_release')?.valueChanges.subscribe(value => {
      if (value) {
        const releaseDate = new Date(value);
        releaseDate.setFullYear(releaseDate.getFullYear() + 1);

        this.productForm.get('date_revision')?.setValue(releaseDate.toISOString().split('T')[0], { emitEvent: false });
      }
    });
  }

  fireAction() {
    const idFormControl = this.productForm.get('id');
    if (this.productService.isCreating) {
      this.createProduct();
      return;
    } else {
      idFormControl?.disable();
      this.updateProduct();
      return;
    }
  }

  createProduct() {
    this.submitted = true;
    if (!this.productForm.invalid) {
      const productData = this.productForm.value;

      let year = productData.date_release.split('-')[0];
      year = parseInt(year) + 1;
      productData.date_revision = year + productData.date_release.substring(4);

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
            this.productService.isCreating = false;
            console.log('Product created:', response);
          } else {
            console.log('Product creation failed');
          }
        });
    }
  }

  updateProduct() {
    // Verify if product exists
    const productId = this.product.id;
    this.productService.verifyProductExists(productId)
      .pipe(
        catchError(error => {
          console.log('Error verifying product:', error);
          return of(null); // Return a safe observable in case of error
        })
      )
      .subscribe(response => {
        if (response) {
          this.submitted = true;
          if (!this.productForm.invalid) {
            const productData = this.productForm.value;

            let year = productData.date_release.split('-')[0];
            year = parseInt(year) + 1;
            productData.date_revision = year + productData.date_release.substring(4);

            console.log('Product data:', productData);

            if (confirm('¿Estás seguro que desea actualizar este producto?')) {
              this.productService.updateProduct(productData.id, productData)
                .pipe(
                  catchError(error => {
                    console.log('Error updating product:', error);
                    return of(null); // Return a safe observable in case of error
                  })
                )
                .subscribe(response => {
                  if (response) {
                    alert('Product updated successfully');
                    this.router.navigate(['']);
                    console.log('Product updated:', response);
                  } else {
                    console.log('Product update failed');
                  }
                });
              }
          }
        } else {
          console.log('Product does not exist');
          alert('Product does not exist');
        }
      });
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
