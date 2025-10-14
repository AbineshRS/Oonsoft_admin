import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { BackendapiService } from '../../services/backendapi.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '../../components/header/header';
import { SideMenubar } from '../../components/side-menubar/side-menubar';
import { AddProductKey } from "../add-product-key/add-product-key";
import { environment } from '../../environtments/environment';

@Component({
  selector: 'app-digial-product-chekout-view',
  imports: [CommonModule, FormsModule, AddProductKey],
  templateUrl: './digial-product-chekout-view.html',
  styleUrl: './digial-product-chekout-view.css'
})
export class DigialProductChekoutView {
  @Input() checkoutId!: string;
  @Input() AddressId!: string;
  @Output() closeModal = new EventEmitter<void>();

  private cdr = inject(ChangeDetectorRef);

  private route = inject(ActivatedRoute);
  private service = inject(BackendapiService)
  listofProdct: any[] = [];
  listofuserdata: any;
  selectedCheckoutId: any
  ProductId: any
  showModal = false;
  baseUrl = environment.image;
  listofAddress: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['checkoutId'] && changes['checkoutId'].currentValue) {
      this._getaddress_details()
      this._getchekout_details();  // ✅ Load the product data

    }
  }

  productClose() {
    this.closeModal.emit();
  }

  _getchekout_details() {
    this.service.digital_details(this.checkoutId).subscribe({
      next: (res) => {
        this.listofProdct = res;
        this.cdr.detectChanges();
      }
    })
  }
  onModalClosed() {
    this.showModal = false;

  }
  openAddProductKey(checkoutlistId: string, product_id: string) {
    this.selectedCheckoutId = checkoutlistId;
    this.ProductId = product_id
    this.showModal = true;
  }
  generateButtons(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }
  _getaddress_details() {
    this.service.address_details(this.AddressId).subscribe({
      next: (res) => {
        this.listofAddress = res.data;
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 100);
      }
    })
  }
}
