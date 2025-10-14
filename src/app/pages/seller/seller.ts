import { Component, EventEmitter, inject, Output } from '@angular/core';
import { BackendapiService } from '../../services/backendapi.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seller',
  standalone: true,

  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './seller.html',
  styleUrl: './seller.css'
})
export class Seller {
  @Output() closeModal = new EventEmitter<void>();
  private service = inject(BackendapiService);
  private fromBuilder = inject(FormBuilder);
  errorMsg: any;
  showPassword: boolean = false;
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  sellerForm = this.fromBuilder.group({
    userName: ['', Validators.required],
    password: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit() {
    this.errorMsg = '';

    if (this.sellerForm.invalid) {
      this.sellerForm.markAllAsTouched();
      return;
    }

    const formValues = this.sellerForm.value;

    const data = {
      userName: formValues.userName,
      password: formValues.password,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      fullName: `${formValues.firstName} ${formValues.lastName}`,
      email: formValues.email,
    };


    this.service.registerSeller(data).subscribe({
      next: (res) => {
        const result = res?.value;

        if (result.success === false) {
          this.errorMsg = result.message || 'Registration failed.';
          alert(this.errorMsg);
          this.closeModal.emit();

          return;
        }
        alert(' Seller registered successfully!');
        this.closeModal.emit();
      },
      error: (err) => {
        this.errorMsg = 'Something went wrong while registering seller!';
      }
    });
  }


}
