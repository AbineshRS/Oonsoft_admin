import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { SideMenubar } from '../../../components/side-menubar/side-menubar';
import { Header } from '../../../components/header/header';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackendapiService } from '../../../services/backendapi.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { Router } from '@angular/router';
import { AddCountries } from "../add-countries/add-countries";
import { merge } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-countries-list',
  imports: [SideMenubar, Header, CommonModule, FormsModule, NgxPaginationModule, AddCountries],
  templateUrl: './countries-list.html',
  styleUrl: './countries-list.css'
})
export class CountriesList {
  isSidebarOpen = true;
  isLoading = false;
  searchText: string = '';
  listOfcountries: any;
  listOfActivecountries: any;
  private service = inject(BackendapiService);
  sellerId: any;
  constructor(private router: Router, private cdr: ChangeDetectorRef) { }

  page: number = 1;
  count: number = 0;
  requestLimit: number = 8;
  tableSize: number = 5;
  tableSizes: any = [3, 6, 9, 12];
  showModal = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  ngOnInit(): void {
 this.sellerId = sessionStorage.getItem('seller_id');

    if (!this.sellerId) {
      this.router.navigate(['']);
      return;
    }
    this._getListOfcountries();
  }

  _getListOfcountries() {
    this.isLoading = true;
    this.service.countrieslist().subscribe({
      next: (res) => {

        this.listOfcountries = res.data;
        this.listOfActivecountries = res.data;
        setTimeout(() => {
          this.cdr.detectChanges(); // 🔧 Force view update

        }, 1000);
        this.isLoading = false;
      }
    });
  }


  toggleStatus(user: any) {
    const newStatus = user.status === 'T' ? 'F' : 'T';
    const avl_countries_id = user.avl_countries_id; // local variable

    const payload = {
      status: newStatus
    };
    this.service.countries_status(avl_countries_id, payload).subscribe({
      next: (res) => {
        this._getListOfcountries();

        user.status = newStatus; // Update local UI
      },
      error: (err) => {
      }
    });
  }

  search(searchTerm: string) {

    if (searchTerm.length >= 3) {
      this.listOfActivecountries = this.listOfcountries.filter((item: any) => {
        return (
          item.avl_countries_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    } else {
      this.listOfActivecountries = this.listOfcountries;
    }
  }
  deletecountry(avl_countries_id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this country!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.countries_delete(avl_countries_id).subscribe({
          next: (res) => {
            Swal.fire('Deleted!', res.message, 'success');
            this._getListOfcountries();
          },
          error: (err) => {
            Swal.fire('Error', 'Something went wrong!', 'error');
          }
        });
      }
    });
  }

  onModalClosed() {
    this.showModal = false;
    this._getListOfcountries();

  }
  onTableDataChange(event: number): void {
    this.page = event;
  }
}
