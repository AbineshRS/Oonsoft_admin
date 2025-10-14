import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, NgZone, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SideMenubar } from '../../components/side-menubar/side-menubar';
import { Header } from '../../components/header/header';
import { BackendapiService } from '../../services/backendapi.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NavigationEnd, Router } from '@angular/router';
import { AddProduct } from '../add-product/add-product';
import { PhysicalProductCheckoutView } from "./physical-product-checkout-view/physical-product-checkout-view";
import { UpdatePhysicalProduct } from "./update-physical-product/update-physical-product";
import { NgxPaginationModule } from 'ngx-pagination';
import { environment } from '../../environtments/environment';
import { SignalRService } from '../../services/signalr.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule, SideMenubar, Header, HttpClientModule, AddProduct, UpdatePhysicalProduct, NgxPaginationModule],
  providers: [BackendapiService],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {
  private backendService = inject(BackendapiService)
  isSidebarOpen = true;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  listOfProducts: any;
  listOfActiveproducts: any[] = [];
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
  selectedProductId: string = '';
  showModalproduct = false;
  isLoading: boolean = false;
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

  async ngOnInit(): Promise<void> {
    this.sellerId = sessionStorage.getItem('seller_id');
    if (!this.sellerId) {
      this.router.navigate(['']);
      return;
    }

    this._getListOfProducts();
    // this.signalRService.startConnection()
    //   .then(() => {
    //     this.signalRService.onProductListUpdate(() => {
    //       this.ngZone.run(() => {
    //         this._getListOfProducts();
    //       });
    //     });
    //   })
    this.signalRService.startConnection()
      .then(() => {
        this.signalRService.onSingleProductUpdate(async (productId: string) => {
          await this._refreshSingleProduct(productId);
        });
      });
  }
  _refreshSingleProduct(productId: string) {

    this.backendService.getProductById(productId).subscribe((res) => {
      const updatedProduct = res.data;
      if (!updatedProduct || !updatedProduct.product_id) {
        return;
      }
      const index = this.listOfActiveproducts.findIndex(p => p.product_id === updatedProduct.product_id);
      updatedProduct.imageTimestamp = new Date().getTime();

      if (updatedProduct.status === 'F') {
        if (index !== -1) {
          this.listOfActiveproducts.splice(index, 1);
          this.listOfActiveproducts = [...this.listOfActiveproducts];

        }
        return;
      }
      if (index !== -1) {
        this.listOfActiveproducts[index] = updatedProduct;
      } else {
        this.listOfActiveproducts.push(updatedProduct);
      }
      this.listOfActiveproducts = [...this.listOfActiveproducts];
    });

    // console.log('list',this.listOfActiveproducts)
    // this.cdr.detectChanges();
    // this.ngZone.run(() => {
    //   this.listOfActiveproducts = [...this.listOfActiveproducts];
    //   console.log('final',this.listOfActiveproducts)
    //   this.cdr.detectChanges();
    // });
  }


  _getListOfProducts() {
    this.isLoading = true;
    this.sellerId = sessionStorage.getItem('seller_id');

    this.backendService.Productlist(this.sellerId).subscribe({
      next: (res) => {

        this.listOfProducts = res.data;
        this.listOfActiveproducts = res.data;
        this.cdr.detectChanges(); // 🔧 Force view update
        setTimeout(() => {
          this.isLoading = false;
          this.cdr.detectChanges(); // ✅ force Angular to re-check view
        }, 1000);
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

  openModal(productId: string) {

    this.selectedProductId = productId;

    this.showModalproduct = true;
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
            Swal.fire('Deleted!', res.message, 'success');
            this._getListOfProducts();
          }
        })
      }
    });

  }
  closeModal() {
    this.cdr.detectChanges();
    this.showModalproduct = false;
    this._getListOfProducts();
  }
  onTableDataChange(event: number): void {
    this.page = event;
  }
  onTableSizeChange(event: any): void {
    this.tableSize = +event.target.value;
    this.page = 1;
  }
}
