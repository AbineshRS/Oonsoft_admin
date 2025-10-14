import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { BackendapiService } from '../../../services/backendapi.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-oonsoft-update-product',
  imports: [CommonModule,FormsModule],
  templateUrl: './oonsoft-update-product.html',
  styleUrl: './oonsoft-update-product.css'
})
export class OonsoftUpdateProduct {
  @Output() close = new EventEmitter<void>();
@Input() productId: string = '';
  constructor(private cdRef: ChangeDetectorRef) { }

  @Input() product: any;
  private service = inject(BackendapiService);
  listofProduct: any;
  
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
  onClose() {
    this.close.emit();
  }
}
