import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Header } from '../../components/header/header';
import { SideMenubar } from '../../components/side-menubar/side-menubar';
import { BackendapiService } from '../../services/backendapi.service';
import { Router } from '@angular/router';
import { AddProductKey } from "../add-product-key/add-product-key";
import { AddOnsoftProduct } from "../add-onsoft-product/add-onsoft-product";
import { OonsoftViewProduct } from "./oonsoft-view-product/oonsoft-view-product";
import { NgxPaginationModule } from 'ngx-pagination';
import { environment } from '../../environtments/environment';
import { SignalRService } from '../../services/signalr.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-oonsoft-product-list',
  imports: [CommonModule, FormsModule, Header, SideMenubar, AddOnsoftProduct, OonsoftViewProduct, NgxPaginationModule],
  templateUrl: './oonsoft-product-list.html',
  styleUrl: './oonsoft-product-list.css'
})
export class OonsoftProductList {
  private service = inject(BackendapiService);
  constructor(private router: Router, private cdr: ChangeDetectorRef, private signalRService: SignalRService, private ngZone: NgZone) { }
  isSidebarOpen = true;
  listOfProducts: any;
  listOfActiveproducts: any;
  searchText: string = '';
  sellerId: any;
  searchTerm: any;
  oonsoft_product_id: any
  showModal = false;
  showModalproduct = false;
  updatemodel = false;
  selectedProductId: string = '';
  page: number = 1;
  count: number = 0;
  requestLimit: number = 8;
  tableSize: number = 6;
  tableSizes: any = [3, 6, 9, 12];
  isLoading = false;
  baseUrl = environment.image;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  ngOnInit(): void {
    this.sellerId = sessionStorage.getItem('seller_id');

    if (!this.sellerId) {
      this.router.navigate(['']);
      return;
    }
    this.signalRService.startConnection()
      .then(() => {
        this.signalRService.onProductListUpdate(() => {
          this.ngZone.run(() => {
            this._getListOfProducts();
          });
        });
      })
    this._getListOfProducts();

  }
  search(searchTerm: string) {

    if (searchTerm.length >= 3) {
      this.listOfActiveproducts = this.listOfProducts.filter((item: any) => {
        return (
          item.oonsoft_product_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    } else {
      this.listOfActiveproducts = this.listOfProducts;
    }
  }
  _getListOfProducts() {
    this.isLoading = true;
    this.service.OonsoftProductlist().subscribe({
      next: (res) => {

        this.listOfProducts = res.data;
        this.listOfActiveproducts = res.data;
        setTimeout(() => {
          this.cdr.detectChanges(); // 🔧 Force view update

        }, 1000);
        this.isLoading = false;
      }
    });
  }
  onModalClosed() {
    this.showModal = false;
    this._getListOfProducts();
  }
  toggleStatus(user: any) {
    const newStatus = user.status === 'T' ? 'F' : 'T';
    const Oonsoft_product_id = user.oonsoft_product_id; // local variable

    const payload = {
      status: newStatus
    };
    this.service.Oonsoft_addProduct_status(Oonsoft_product_id, payload).subscribe({
      next: (res) => {
        this._getListOfProducts();

        user.status = newStatus; // Update local UI
      },
      error: (err) => {
      }
    });
  }
  DeleteProduct(oonsoft_product_id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover Product!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete_oonsoft_product(oonsoft_product_id).subscribe({
          next: (res) => {
            Swal.fire('Deleted!', res.message, 'success');
            this._getListOfProducts();
          }
        })
      }
    });

  }
  closeModal() {
    this.showModalproduct = false;
    this._getListOfProducts();
  }
  openModal(productId: string) {
    this.selectedProductId = productId;

    this.showModalproduct = true;
  }
  updateclose() {
    this.updatemodel = false;
  }

  editProduct(productId: string) {
    this.selectedProductId = productId;

    this.updatemodel = true;
  }
  onTableDataChange(event: number): void {
    this.page = event;
  }
}
