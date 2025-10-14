import { ChangeDetectorRef, Component, inject, NgZone } from '@angular/core';
import { BackendapiService } from '../../services/backendapi.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SideMenubar } from '../../components/side-menubar/side-menubar';
import { Header } from '../../components/header/header';
import { Router } from '@angular/router';
import { PhysicalProductCheckoutView } from "../product-list/physical-product-checkout-view/physical-product-checkout-view";
import { NgxPaginationModule } from 'ngx-pagination';
import { SignalRService } from '../../services/signalr.service';
import { environment } from '../../environtments/environment';

@Component({
  selector: 'app-checkout-list',
  imports: [CommonModule, FormsModule, SideMenubar, Header, PhysicalProductCheckoutView, NgxPaginationModule],
  templateUrl: './checkout-list.html',
  styleUrl: './checkout-list.css'
})
export class CheckoutList {
  private service = inject(BackendapiService);
  constructor(private router: Router, private cdr: ChangeDetectorRef, private signalRService: SignalRService, private ngZone: NgZone) { }
  isSidebarOpen = true;
  listOfcheckout: any[] = [];
  listOfcheckoutlist: any[] = [];
  listOfinvoice: any;
  searchText: string = '';
  sellerId: any;
  searchTerm: any;
  Modal = false;
  isLoading = false;
  selectedProductId: string = '';
  selectedAddressId: string = '';
  page: number = 1;
  requestLimit: number = 8;
  tableSize: number = 5;
  tableSizes: any = [3, 6, 9, 12];
  count: number = 0;
  baseUrl = environment.image;

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
    const res = await this.service.getCekoutphysical_productById(checkout_id).toPromise();
    const updated_data = res;
    if (!updated_data) {
      return;
    }
    const index = this.listOfcheckoutlist.findIndex(a => a.checkout_id === updated_data.checkout_id);
    const masterIndex = this.listOfcheckout.findIndex(a => a.checkout_id === updated_data.checkout_id);

    if (index !== -1) {
      this.listOfcheckoutlist[index] = updated_data;
    } else {
      // this.listOfcheckoutlist.push(updated_data);
    }

    if (masterIndex !== -1) {
      this.listOfcheckoutlist[masterIndex] = updated_data;
    } else {
      this.listOfcheckoutlist.push(updated_data);
    }
    this.listOfcheckoutlist = [...this.listOfcheckoutlist];
    this.listOfcheckout = [...this.listOfcheckout];
    this.cdr.detectChanges();
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  _getListOfCheckout() {
    this.isLoading = true
    this.sellerId = sessionStorage.getItem('seller_id');

    this.service.checkoutlist(this.sellerId).subscribe({
      next: (res) => {
        this.listOfcheckout = res.data;
        this.listOfcheckoutlist = res.data;
        setTimeout(() => {
          this.isLoading = false
          this.cdr.detectChanges(); // 🔧 Force view update
        }, 1000);
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
  onView(checkoutlist_id: any, address_id: any) {
    this.isLoading = true;
    this.selectedProductId = checkoutlist_id;
    this.selectedAddressId = address_id;
    // this.router.navigate(['view_chekout_list',checkoutlist_id]);
    // You can replace this with a modal, navigation, etc.
    this.Modal = true;

  }
  onChildReady() {
    this.isLoading = false; // Hide spinner when child signals it's ready
  }

  closeModal() {
    this.Modal = false;

  }
  onStatusChange(user: any): void {
    this.isLoading = true;

    const selectedStatus = user.im_Checkoutlists[0].status;
    const checkoutId = user.checkout_id;

    // Apply the selected status to all items in im_Checkoutlists
    const updatedList = user.im_Checkoutlists.map((item: any) => {
      return {
        checkoutlist_id: item.checkoutlist_id,
        status: selectedStatus
      };
    });

    const payload = {
      im_Checkoutlists: updatedList
    };


    this.service.Update_status(checkoutId, payload).subscribe({
      next: (res) => {
        alert('Status updated successfully');

        this.isLoading = false;

      },
      error: (err) => {
      }
    });




    // this.http.post('/api/checkout/update-status', payload).subscribe({
    //   next: (res) => {
    //     console.log('Status updated successfully', res);
    //   },
    //   error: (err) => {
    //     console.error('Error updating status', err);
    //   }
    // });
  }
  onViewInvoice(checkout_id: any) {
    this.service.invoiceDetails(checkout_id).subscribe({
      next: (res) => {
        debugger
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
