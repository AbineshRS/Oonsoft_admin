import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  activeDropdown: string | null = null;
  activeSlider: string | null = null;
  isSidebarOpen = false;
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  constructor(private router: Router) { }
  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }


  toggleDropdown(menu: string) {
    this.activeDropdown = this.activeDropdown === menu ? null : menu;
    this.activeSlider = null; // close sliders if dropdown opened
  }

  toggleSlider(menu: string) {
    this.activeSlider = this.activeSlider === menu ? null : menu;
    this.activeDropdown = null; // close dropdowns if slider opened
  }

  closeSlider() {
    this.activeSlider = null;
  }

  // Example cart items
  cartItems = [
    { name: 'Cotton collar t-shirts for men', price: 155.32, quantity: 2, category: 'Fashion', image: 'https://i.pravatar.cc/40' },
    { name: 'Like style travel black handbag', price: 349.95, quantity: 1, category: 'Luggage', image: 'https://i.pravatar.cc/41' },
  ];

  // Charges
  discount = 341.71;
  shipping = 0;
  taxRate = 0.125; // 12.5%

  // Quantity Controls
  increaseQuantity(index: number) {
    this.cartItems[index].quantity++;
  }

  decreaseQuantity(index: number) {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
    }
  }

  removeItem(index: number) {
    this.cartItems.splice(index, 1);
  }

  // Calculations
  getSubTotal() {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getTax() {
    return this.getSubTotal() * this.taxRate;
  }

  getTotal() {
    return this.getSubTotal() - this.discount + this.shipping + this.getTax();
  }
  onLogout() {
    sessionStorage.removeItem('seller_id');
    this.router.navigate(['/']);
  }
}
