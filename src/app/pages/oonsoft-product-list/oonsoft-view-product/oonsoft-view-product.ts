import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BackendapiService } from '../../../services/backendapi.service';
import { environment } from '../../../environtments/environment';

@Component({
  selector: 'app-oonsoft-view-product',
  imports: [CommonModule, FormsModule],
  templateUrl: './oonsoft-view-product.html',
  styleUrl: './oonsoft-view-product.css'
})
export class OonsoftViewProduct {
  @Input() productId: string = '';
  constructor(private cdRef: ChangeDetectorRef) { }

  @Input() product: any;
  @Output() close = new EventEmitter<void>();
  private service = inject(BackendapiService);
  listofProduct: any;
  imagePreviewUrl: string | null = null;
  selectedImageFile: File | null = null;
  isSaving = false;
  baseUrl = environment.image;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this._prodct_details();
  }
  _prodct_details() {
    this.service.oonsoft_details(this.productId).subscribe({
      next: (res) => {

        this.listofProduct = res.data;
        this.cdRef.detectChanges();

      }
    })
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
    this.close.emit();
  }
  onSave(titleInput: any, descInput: any): void {
      this.isSaving = true;

    if (titleInput.invalid || descInput.invalid) {
      titleInput.control.markAsTouched();
      descInput.control.markAsTouched();
      return;
    }

    const updateData = {
      title: this.listofProduct.title,
      description: this.listofProduct.description,
    };

    this.service.Oonsoft_updateprodct(this.productId, updateData).subscribe({
      next: (res) => {

        if (this.selectedImageFile) {
          const imageFormData = new FormData();
          imageFormData.append('image', this.selectedImageFile);
          this.service.Oonsoft_uploadProductImage(this.productId, this.selectedImageFile)
            .subscribe({
              next: (imgRes) => {
                this.onClose(); // Close drawer after all
                  this.isSaving = false;

              },
            });
        } else {
          this.onClose(); // No image change, just close
        }
      },
    });
  }
}
