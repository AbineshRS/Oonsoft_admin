import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { BackendapiService } from '../../services/backendapi.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-onsoft-product',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-onsoft-product.html',
  styleUrl: './add-onsoft-product.css'
})
export class AddOnsoftProduct {
  @Output() closeModal = new EventEmitter<void>();

  private service = inject(BackendapiService);
  private fromBuilder = inject(FormBuilder);
  errorMsg: any;
  selectedImages: any;
  selectedImagesPreview: string[] = [];
  isSubmitting = false;

  productForm = this.fromBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    created_at: [new Date().toISOString()],

  });
  onSubmit() {
    this.isSubmitting = true;

    this.errorMsg = '';

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      console.warn('Form invalid at submit');
      return;
    }

    const data = {
      title: this.productForm.value.title,
      description: this.productForm.value.description,
      created_at: this.productForm.value.created_at,
    };

    this.service.Oonsoft_addProduct(data).subscribe({

      next: (res: any) => {
        const productId = res?.value?.data?.oonsoft_product_id;
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

        if (this.selectedImages) {
          this.service.Oonsoft_uploadProductImage(productId, this.selectedImages).subscribe({
            next: (imgRes: any) => {
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
              // alert('✅ Product added and image uploaded successfully!');
              this.isSubmitting = false;

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
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0]; // ✅ single file
      this.selectedImages = file;
      this.selectedImagesPreview = [URL.createObjectURL(file)];
    }
  }


  close() {
    this.closeModal.emit();
  }
}
