import { ChangeDetectorRef, Component, inject, NgZone } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BackendapiService } from '../../services/backendapi.service';
import { CommonModule } from '@angular/common';
import { Header } from '../../components/header/header';
import { SideMenubar } from '../../components/side-menubar/side-menubar';
import { AddProduct } from '../add-product/add-product';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DigitalProdctUpdate } from "./digital-prodct-update/digital-prodct-update";
import { NgxPaginationModule } from 'ngx-pagination';
import { environment } from '../../environtments/environment';
import { SignalRService } from '../../services/signalr.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-digital-product-list',
  standalone: true,
  imports: [CommonModule, Header, SideMenubar, AddProduct, FormsModule, ReactiveFormsModule, DigitalProdctUpdate, NgxPaginationModule],
  templateUrl: './digital-product-list.html',
  styleUrl: './digital-product-list.css'
})
export class DigitalProductList {
  private backendService = inject(BackendapiService)
  isSidebarOpen = true;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  listOfProducts: any;
  listOfActiveproducts: any;
  isFetchingList = false;

  page: number = 1;
  count: number = 0;
  showModal = false;

  requestLimit: number = 8;
  tableSize: number = 5;
  tableSizes: any = [3, 6, 9, 12];
  searchText: any;
  selectedDate: string = '';
  selectedStatus: string = '';
  sellerId: any;
  searchTerm: any;
  ismodel = false;
  isLoading = false;
  selectedProductId: any
  baseUrl = environment.image;

  constructor(private router: Router, private cdr: ChangeDetectorRef, private signalRService: SignalRService, private ngZone: NgZone) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this._getListOfProducts();
      }
    });
  }


  onModalClosed() {
    this.showModal = false;
    this._getListOfProducts();
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


  _getListOfProducts() {
    this.isLoading = true
    this.sellerId = sessionStorage.getItem('seller_id');

    this.backendService.digitalProductlist(this.sellerId).subscribe({
      next: (res) => {

        this.listOfProducts = res.data;
        this.listOfActiveproducts = res.data;
        setTimeout(() => {
          this.cdr.detectChanges(); // 🔧 Force view update
        }, 1000)
        this.isLoading = false

      }
    });
  }
  search(searchTerm: string) {

    if (searchTerm.length >= 3) {
      this.listOfActiveproducts = this.listOfProducts.filter((item: any) => {
        return (
          item.product_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.brand.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    } else {
      this.listOfActiveproducts = this.listOfProducts;
    }
  }
  DeleteProduct(product_id: string) {
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
        this.backendService.delete_product(product_id).subscribe({
          next: (res) => {
            // const message = res.message;
            // alert(message);
            Swal.fire('Deleted!', res.message, 'success');
            this._getListOfProducts();

          }
        })
      }
    })
  }
  openModal(productId: string) {
    this.selectedProductId = productId;

    this.ismodel = true;
  }
  onClose() {
    this.ismodel = false;

    this._getListOfProducts();
    // this.cdr.detectChanges(); // 🔧 Force view update

  }
  onTableDataChange(event: number): void {
    this.page = event;
  }
}
