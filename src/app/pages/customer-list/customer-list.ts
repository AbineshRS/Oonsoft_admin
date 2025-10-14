import { ChangeDetectorRef, Component, inject, NgZone } from '@angular/core';
import { BackendapiService } from '../../services/backendapi.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SideMenubar } from '../../components/side-menubar/side-menubar';
import { Header } from '../../components/header/header';
import { CustomerDetails } from "./customer-details/customer-details";
import { NgxPaginationModule } from 'ngx-pagination';
import { SignalRService } from '../../services/signalr.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-list',
  imports: [CommonModule, FormsModule, SideMenubar, Header, CustomerDetails, NgxPaginationModule],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css'
})
export class CustomerList {
  private service = inject(BackendapiService);
  constructor(private router: Router, private cdr: ChangeDetectorRef, private signalRService: SignalRService, private ngZone: NgZone) { }
  isSidebarOpen = true;
  listOfcustomer: any;
  listOfcustomerlist: any[] = [];
  searchText: string = '';
  sellerId: any;
  searchTerm: any;
  selecteduserId: any;
  customerDetails = false;
  page: number = 1;
  count: number = 0; requestLimit: number = 8;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];
  isLoading = false
  ngOnInit(): void {
    this.sellerId = sessionStorage.getItem('seller_id');

    if (!this.sellerId) {
      this.router.navigate(['']);
      return;
    }
    this.signalRService.startConnection()
      .then(() => {
        this.signalRService.onCustomer((checkout_id: string) => {
          this.ngZone.run(async () => {
            // Add a short delay to ensure the backend has completed the update
            await new Promise(res => setTimeout(res, 200));
            await this._updatecustomerdata(checkout_id);
          });
        });
      });

    this._getListOfCheckout();

  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  async _updatecustomerdata(userId: string) {
    const res = await this.service.customer_details(userId).toPromise();
    const updated_data = res.data;
    if (!updated_data) {
      return;
    }
    const index = this.listOfcustomerlist.findIndex(a => a.userId === updated_data.userId);
    if (index !== -1) {
      this.listOfcustomerlist[index] = updated_data;
    } else {
      this.listOfcustomerlist.push(updated_data);
    }
    this.listOfcustomerlist = [...this.listOfcustomerlist];
    this.cdr.detectChanges();
  }
  _getListOfCheckout() {
    this.isLoading = true;
    this.sellerId = sessionStorage.getItem('seller_id');

    this.service.customerlist().subscribe({
      next: (res) => {
        this.listOfcustomer = res.data;

        this.listOfcustomerlist = res.data;
        setTimeout(() => {
          this.cdr.detectChanges(); // 🔧 Force view update

        }, 1000);
        this.isLoading = false;

      }

    });
  }
  search(searchTerm: string) {

    if (searchTerm.length >= 3) {
      this.listOfcustomerlist = this.listOfcustomer.filter((item: any) => {
        return (
          item.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.fullName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    } else {
      this.listOfcustomerlist = this.listOfcustomer;
    }
  }
  openModal(userId: string) {
    this.selecteduserId = userId;
    this.customerDetails = true
  }
  closeModal() {
    this.customerDetails = false;
    this._getListOfCheckout();

  }
  toggleStatus(user: any) {
    const newStatus = user.status === 'T' ? 'F' : 'T';
    const userId = user.userId; // local variable

    const payload = {
      status: newStatus
    };
    if (newStatus === 'T') {
      Swal.fire({
        title: 'Set as Active?',
        text: 'Are you sure you want to set this user as Aactive?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, Aactive'
      }
      ).then((result) => {
        if (result.isConfirmed) {
          this.service.customer_status(userId, payload).subscribe({
            next: (res) => {

              this._getListOfCheckout();
            Swal.fire('Status updated successfully!', res.message, 'success');
              user.status = newStatus; // Update local UI
            },
            error: (err) => {
            }
          });
        }
      })
    }
    if (newStatus === 'F') {
      Swal.fire({
        title: 'Set as Inactive?',
        text: 'Are you sure you want to set this user as inactive?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, deactivate'
      }
      ).then((result) => {
        if (result.isConfirmed) {
          this.service.customer_status(userId, payload).subscribe({
            next: (res) => {

              this._getListOfCheckout();
            Swal.fire('Status updated successfully!', res.message, 'success');
              user.status = newStatus; // Update local UI
            },
            error: (err) => {
            }
          });
        }
      })
    }
  }
  onTableDataChange(event: number): void {
    this.page = event;
  }
}
