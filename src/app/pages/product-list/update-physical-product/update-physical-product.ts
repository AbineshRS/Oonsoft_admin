import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { BackendapiService } from '../../../services/backendapi.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environtments/environment';

@Component({
  selector: 'app-update-physical-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-physical-product.html',
  styleUrl: './update-physical-product.css'
})
export class UpdatePhysicalProduct {
  @Input() productId: string = '';
  constructor(private cdRef: ChangeDetectorRef) { }

  @Input() product: any;
  @Output() close = new EventEmitter<void>();
  private service = inject(BackendapiService);
  listofProduct: any;
  imagePreviewUrl: string | null = null;
  selectedImageFile: File | null = null;
  isSaving: boolean = false;
  baseUrl = environment.image;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productId'] && changes['productId'].currentValue) {
      this._prodct_details();
    }
  }

  _prodct_details() {
    this.service.Physical_details(this.productId).subscribe({
      next: (res) => {

        this.listofProduct = res.data;
        this.cdRef.detectChanges();

      }
    })
  }
  toggleStatus(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.listofProduct.status = isChecked ? 'T' : 'F';
  }

  closeModal() {
    this._prodct_details();
    this.close.emit();
  }
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      this.selectedImageFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;

        // Force Angular to detect the change
        this.cdRef.detectChanges();
      };
      reader.readAsDataURL(this.selectedImageFile);
    }
  }

  onClose() {
    this._prodct_details();
    this.close.emit();
  }
  onSave() {
    this.isSaving = true;
    const payload = {
      product_id: this.listofProduct.product_id,
      userId: this.listofProduct.userId,
      title: this.listofProduct.title,
      description: this.listofProduct.description,
      brand: this.listofProduct.brand,
      thumbnail_url: this.listofProduct.thumbnail_url || '',
      price: this.listofProduct.price,
      stock_quantity: this.listofProduct.stock_quantity,
      status: this.listofProduct.status,
      im_ProductImages: this.listofProduct.im_ProductImages || []
    };
    this.service.Physical_update(this.productId, payload).subscribe({
      next: (res) => {
        this.cdRef.detectChanges();
        this.isSaving = false;
        // Upload image if selected
        if (this.selectedImageFile) {
          this.service.uploadProductImage(this.productId, [this.selectedImageFile]).subscribe({
            next: (imgRes) => {
              this._prodct_details(); // Refresh data
              this.selectedImageFile = null;
              this.imagePreviewUrl = null;
              this.closeModal(); // close drawer/modal
              this.isSaving = false;

            },
            error: (err) => {
            }
          });
        } else {
          this.closeModal(); // no image, just close
        }
      },
      error: (err) => {
      }
    });
  }

}
