import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendapiService } from '../../../services/backendapi.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environtments/environment';

@Component({
  selector: 'app-physical-product-checkout-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './physical-product-checkout-view.html',
  styleUrl: './physical-product-checkout-view.css'
})
export class PhysicalProductCheckoutView {
  @Input() checkoutId!: string;
  @Input() AddressId!: string;
  @Output() closeModal = new EventEmitter<void>();
  @Output() ready = new EventEmitter<void>();

  private cdr = inject(ChangeDetectorRef);

  private route = inject(ActivatedRoute);
  private service = inject(BackendapiService)
  listofProdct: any[] = [];
  listofAddress: any;
  listofuserdata: any;
  baseUrl = environment.image;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['checkoutId'] && changes['checkoutId'].currentValue) {
      this._getchekout_details();  // ✅ Load the product data
      this._getaddress_details();
    }

  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this._getaddress_details()
  }
  productClose() {
    this.closeModal.emit();
  }
  _getaddress_details() {
    this.service.address_details(this.AddressId).subscribe({
      next: (res) => {
        this.listofAddress = res.data;
        setTimeout(() => {
          this.cdr.detectChanges();
          this.ready.emit();
        }, 100);
      }
    })
  }
  _getchekout_details() {
    this.service.checkout_details(this.checkoutId).subscribe({
      next: (res) => {
        this.listofProdct = res;
        setTimeout(() => {
          this.cdr.detectChanges();
          this.ready.emit();
        }, 100);
      }
    })
  }
}
