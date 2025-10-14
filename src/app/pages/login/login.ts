import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { Seller } from '../seller/seller';
import { BackendapiService } from '../../services/backendapi.service';
import Swal from 'sweetalert2';
import { NgToastModule, NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgToastModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {


  message: string = '';
  isSuccess: boolean = false;
  showModal = false;
  private fromBuilder = inject(FormBuilder);
  private service = inject(BackendapiService)
  errorMsg: any;
  isSubmitting = false;

  constructor(private router: Router, private cdr: ChangeDetectorRef, private toast: NgToastService) { }

  sellerForm = this.fromBuilder.group({
    userName: ['', Validators.required],
    password: ['', Validators.required],
  });


  onSubmit() {
    this.errorMsg = '';
    this.isSubmitting = true

    const data = {
      userName: this.sellerForm.value.userName,
      password: this.sellerForm.value.password,

    };

    if (this.sellerForm.invalid) {
      this.sellerForm.markAllAsTouched();
      return;
    }




    this.service.sellerlogin(data).subscribe({
      next: (res) => {
        debugger
        this.isSubmitting = false;
        this.cdr.detectChanges(); // 👈 force UI update

        const result = res?.value;

        if (!res.success) {
          this.toast.danger(
            res.message || 'Invalid username or password',
            'Login Failed',
            3000,
            true,  // show progress bar
            true,  // dismissible
            true   // show icon
          );


          return;
        }
        this.isSubmitting = false;

        this.toast.success(
          'Login successful!',
          'Success',
          3000,
          true,   // show progress bar
          true,   // dismissible
          true    // show icon
        )
        this.router.navigate(['product_list']);
        const seller = res?.data;
        if (seller?.seller_id) {
          sessionStorage.setItem('seller_id', seller.seller_id);


        }

      },
      error: (err) => {
        this.isSubmitting = false;
        this.cdr.detectChanges(); // 👈 force UI update

        this.errorMsg = 'Something went wrong while registering seller!';
      }
    });
  }
  clearError() {
    this.errorMsg = '';
  }

}
