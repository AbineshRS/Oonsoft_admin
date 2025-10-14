import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BackendapiService } from '../../services/backendapi.service';

@Component({
  selector: 'app-add-product-key',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-product-key.html',
  styleUrl: './add-product-key.css'
})
export class AddProductKey {
  @Input() checkoutId!: string; // <-- Add this
  @Input() ProductId!: string; // <-- Add this

  @Output() closeModal = new EventEmitter<void>();
  @Output() fileUploaded = new EventEmitter<File>();
  private service = inject(BackendapiService);
  private fromBuilder = inject(FormBuilder);
  errorMsg: any;
  selectedImages: any;
loading = false;

  productForm = this.fromBuilder.group({
    digital_key: ['', Validators.required],
    url: ['', Validators.required],

  });
  onModalClosed() {
    this.closeModal.emit();
  }
  onSubmit() {
    this.loading = true;
    this.errorMsg = '';

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const data = {
      checkout_id: this.checkoutId,
      product_id: this.ProductId,
      digital_key: this.productForm.value.digital_key,
      url: this.productForm.value.url,
    };
    this.service.Oonsoft_addProduct_keys(data).subscribe({
      next: (res: any) => {
        const message = res?.success;
        if (message == true) {
          alert('Email send Sucessfully')
          this.loading = false;

          this.closeModal.emit();


        }
      },
      error: (err) => {
        this.errorMsg = 'Something went wrong adding the product!';
      }
    });
  }

  close() {
    this.closeModal.emit();
  }
}
