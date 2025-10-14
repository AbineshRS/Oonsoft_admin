import { ChangeDetectorRef, Component, inject, NgZone } from '@angular/core';
import { BackendapiService } from '../../services/backendapi.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SideMenubar } from '../../components/side-menubar/side-menubar';
import { Header } from '../../components/header/header';
import { AddProductKey } from "../add-product-key/add-product-key";
import { DigialProductChekoutView } from "../digial-product-chekout-view/digial-product-chekout-view";
import { NgxPaginationModule } from 'ngx-pagination';
import { SignalRService } from '../../services/signalr.service';
import { environment } from '../../environtments/environment';

@Component({
  selector: 'app-digital-product-listchekout',
  imports: [CommonModule, FormsModule, Header, SideMenubar, AddProductKey, DigialProductChekoutView, NgxPaginationModule],
  templateUrl: './digital-product-listchekout.html',
  styleUrl: './digital-product-listchekout.css'
})
export class DigitalProductListchekout {
  private service = inject(BackendapiService);
  constructor(private router: Router, private cdr: ChangeDetectorRef, private signalRService: SignalRService, private ngZone: NgZone) { }
  isSidebarOpen = true;
  listOfcheckout: any;
  listOfcheckoutlist: any[] = [];
  searchText: string = '';
  sellerId: any;
  searchTerm: any;
  showModal = false;
  viewMoal = false;
  selectedCheckoutId: number = 0;
  selectedAddressId: string = '';

  isLoading = false;

  page: number = 1;
  count: number = 0;
  requestLimit: number = 8;
  tableSize: number = 5;
  tableSizes: any = [3, 6, 9, 12];
  baseUrl = environment.image;
  listOfinvoice: any;

  ngOnInit(): void {
    this.sellerId = sessionStorage.getItem('seller_id');

    if (!this.sellerId) {
      this.router.navigate(['']);
      return;
    }
    this.signalRService.startConnection()
      .then(() => {
        this.signalRService.onSingleChekout((checkout_id: string) => {
          this.ngZone.run(async () => {
            // Add a short delay to ensure the backend has completed the update
            await new Promise(res => setTimeout(res, 200));
            await this._refreshchkout(checkout_id);
          });
        });
      });

    this._getListOfCheckout();

  }
  async _refreshchkout(checkout_id: string) {

    const res = await this.service.getCekoutdigital_productById(checkout_id).toPromise();
    const update_data = res;
    if (!update_data) {
      return;
    }
    const index = this.listOfcheckoutlist.findIndex(a => a.checkout_id === update_data.checkout_id);
    if (index !== -1) {
      this.listOfcheckoutlist[index] = update_data;
    } else {
      this.listOfcheckoutlist.push(update_data)
    }
    this.listOfcheckoutlist = [...this.listOfcheckoutlist];
    this.cdr.detectChanges();
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  _getListOfCheckout() {
    this.isLoading = true;

    this.sellerId = sessionStorage.getItem('seller_id');

    this.service.digitalcheckoutlist(this.sellerId).subscribe({
      next: (res) => {
        this.listOfcheckout = res.data;

        this.listOfcheckoutlist = this.listOfcheckout;

        setTimeout(() => {

          this.cdr.detectChanges(); // 🔧 Force view update

        }, 1000)
        this.isLoading = false;

      }

    });
  }
  search(searchTerm: string) {

    if (searchTerm.length >= 3) {
      this.listOfcheckoutlist = this.listOfcheckout.filter((item: any) => {
        return (
          item.checkout_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.userId.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    } else {
      this.listOfcheckoutlist = this.listOfcheckout;
    }
  }
  onView(checkoutlist_id: any) {
    this.router.navigate(['digial_product_chekout_view', checkoutlist_id]);
    // You can replace this with a modal, navigation, etc.
  }
  onModalClosed() {
    this.showModal = false;
    this._getListOfCheckout();

  }
  openModal(id: number) {
    this.selectedCheckoutId = id;
    this.showModal = true;
  }
  productClose() {
    this.viewMoal = false;
    this._getListOfCheckout();

  }
  productView(id: number, address_id: any) {
    this.selectedCheckoutId = id;
    this.selectedAddressId = address_id;

    this.viewMoal = true;
  }
  onViewInvoice(checkout_id: any) {
    this.service.invoiceDetails(checkout_id).subscribe({
      next: (res) => {
        this.listOfinvoice = res.data;
        const relativePath = res.data?.invoice_url;
        const pdfUrl = res.data?.invoice_url; // Adjust this based on your actual response
        if (relativePath) {
          const pdfUrl = `${this.baseUrl}${relativePath}`;
          window.open(pdfUrl, '_blank'); // Opens the full URL in a new tab
        } else {
          console.error('PDF URL not found in response.');
        }

      }
    })
  }
  onTableDataChange(event: number): void {
    this.page = event;
  }
}
