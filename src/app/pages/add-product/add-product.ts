import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BackendapiService } from '../../services/backendapi.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css'
})
export class AddProduct {
  @Output() closeModal = new EventEmitter<void>();
  @Input() isDigitalDefault: boolean = false;

  private service = inject(BackendapiService);
  private fromBuilder = inject(FormBuilder);
  errorMsg: any;
  selectedImages: File[] = [];
  selectedImagesPreview: string[] = [];
  isSaving: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isDigitalDefault']) {
      this.productForm.get('isDigital')?.setValue(this.isDigitalDefault);
      this.productForm.get('isDigital')?.disable(); // Disable so user can't change
    }
  }

  close() {
    this.closeModal.emit();
  }

  productForm = this.fromBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    brand: ['', Validators.required],
    // thumbnail_url: [''],
    created_at: [new Date().toISOString()],
    price: [0, [Validators.required, Validators.min(1)]],
    stock_quantity: [0, [Validators.required, Validators.min(0)]],
    isDigital: [false],
    status: ['T'],
  });

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImages = Array.from(input.files);

      // Create image preview URLs
      this.selectedImagesPreview = this.selectedImages.map(file => URL.createObjectURL(file));

    }
  }

  // product-add.component.ts

  onSubmit() {
    this.errorMsg = '';
    this.isSaving = true;
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const data = {
      userId: sessionStorage.getItem('seller_id'),
      title: this.productForm.value.title,
      description: this.productForm.value.description,
      brand: this.productForm.value.brand,
      thumbnail_url: '',
      created_at: this.productForm.value.created_at,
      price: this.productForm.value.price,
      stock_quantity: this.productForm.value.stock_quantity,
      isdigital: this.productForm.get('isDigital')?.value ? 'T' : 'F',
      status: this.productForm.get('status')?.value,
      im_ProductImages: []
    };
    this.service.addProduct(data).subscribe({
      next: (res: any) => {

        const productId = res?.value?.data?.product_id;
        if (!productId) {
          Swal.fire({
            title: 'Product ID!',
            text: 'Product ID not returned by server.',
            icon: 'error',
            confirmButtonText: 'OK'
          })
          this.errorMsg = 'Product ID not returned by server.';
          return;
        }

        if (this.selectedImages && this.selectedImages.length > 0) {

          this.service.uploadProductImage(productId, this.selectedImages).subscribe({
            next: (imgRes) => {
              if (res.value.status === 1) {
                Swal.fire({
                  title: 'Success!',
                  text: res.message || 'Product added successfully.',
                  icon: 'success',
                  confirmButtonText: 'OK'
                }).then(() => {
                  this.close();
                });
              }
              // alert(' Product added and image uploaded successfully!');
              this.isSaving = false;
              this.closeModal.emit();
            },
            error: (err) => {
              this.errorMsg = 'Image upload failed!';
            }
          });
        } else {
          this.closeModal.emit();
        }

      },
      error: (err) => {
        this.errorMsg = 'Something went wrong adding the product!';
      }
    });
  }

  onStatusToggle(isChecked: boolean) {
    // Set 'T' when toggled on, 'F' when off
    this.productForm.patchValue({
      status: isChecked ? 'T' : 'F'
    });
  }


}
