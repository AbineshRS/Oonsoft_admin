import { ChangeDetectorRef, Component, EventEmitter, inject, Input, NgZone, Output } from '@angular/core';
import { BackendapiService } from '../../../services/backendapi.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environtments/environment';

@Component({
  selector: 'app-digital-prodct-update',
  imports: [CommonModule, FormsModule],
  templateUrl: './digital-prodct-update.html',
  styleUrl: './digital-prodct-update.css'
})
export class DigitalProdctUpdate {
  @Input() productId: string = '';
  constructor(private cdRef: ChangeDetectorRef, private ngZone: NgZone) { }

  @Output() close = new EventEmitter<void>();
  private service = inject(BackendapiService);
  listofProduct: any;
  imagePreviewUrl: string | null = null;
  selectedImageFile: File | null = null;
  imageFile: File | null = null;
  loading = false;
  baseUrl = environment.image;

  onClose() {
    this.close.emit();
  }
  ngOnInit(): void {

    this._digitalProduct();
  }
  _digitalProduct() {
    this.service._digitalprodcut(this.productId).subscribe({
      next: (res) => {
        this.listofProduct = res.data
        this.cdRef.detectChanges();
      }
    })
  }
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;

        // 🔥 Manually trigger change detection to ensure UI updates immediately
        this.cdRef.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }
  toggleStatus(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.listofProduct.status = isChecked ? 'T' : 'F';
  }

  onSave() {
    this.loading = true;

    const payload = {
      product_id: this.listofProduct.product_id,
      userId: this.listofProduct.userId,
      title: this.listofProduct.title,
      description: this.listofProduct.description,
      brand: this.listofProduct.brand,
      thumbnail_url: this.listofProduct.thumbnail_url || '',
      created_at: this.listofProduct.created_at || new Date().toISOString(),
      price: this.listofProduct.price,
      stock_quantity: this.listofProduct.stock_quantity,
      status: this.listofProduct.status,
      im_ProductImages: this.listofProduct.im_ProductImages || []
    };

    this.service.digital_updateprodct(this.productId, payload).subscribe({
      next: (res) => {
        this.cdRef.detectChanges();

        // If image is selected, upload it
        if (this.imageFile) {
          // Upload expects an array of files
          this.service.uploadProductImage(this.productId, [this.imageFile]).subscribe({
            next: (imgRes) => {
              this._digitalProduct();
              this.imageFile = null;
              this.imagePreviewUrl = null;
              this.cdRef.detectChanges();
              this.loading = false;

              this.onClose(); // Close modal after image upload

            },
            error: (err) => {
            }
          });
        } else {
          // No image selected, just close the drawer
          this.onClose();
        }
      },
      error: (err) => {
      }
    });
  }


}
