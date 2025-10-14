import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-menubar',
  imports: [CommonModule],
  templateUrl: './side-menubar.html',
  styleUrl: './side-menubar.css'
})
export class SideMenubar {
  @Input() isSidebarOpen: boolean = true;
  openDropdown: string | null = null;

  constructor(private router: Router) { }

  toggleDropdown(menu: string) {
    this.openDropdown = this.openDropdown === menu ? null : menu;
  }

  navigateToMainLayout() {
    this.router.navigate(['/main-layout']);
  }
  checkout() {
    this.router.navigate(['/checkout_list']);

  }
  prodctlist() {
    
    this.router.navigate(['/product_list']);

  }
   customerlist() {
    this.router.navigate(['/customer_list']);

  }
  digitalprodctlist() {
    this.router.navigate(['/digital_product_list']);

  }
  digitalcheckout() {
    this.router.navigate(['/digital_product_listchekout']);

  }
   Oonsoft_products() {
    this.router.navigate(['/Oonsoft_product_list']);

  }
   countries() {
    this.router.navigate(['/countries_list']);

  }
  
}
