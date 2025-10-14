import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BackendapiService } from '../../../services/backendapi.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-countries',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-countries.html',
  styleUrl: './add-countries.css'
})
export class AddCountries {
  @Output() closeModal = new EventEmitter<void>();
  private fromBuilder = inject(FormBuilder);
  private service = inject(BackendapiService);
  constructor(private cdr: ChangeDetectorRef) { }

  errorMsg: any;

  activeSlider = true;
  isSubmitting = false;

  countryForm = this.fromBuilder.group({
    name: ['', Validators.required],

  });
  closeSlider() {
    this.closeModal.emit();
  }
  close() {
    this.closeModal.emit();
  }
  onSubmit() {
    this.errorMsg = '';

    if (this.countryForm.invalid) {
      this.countryForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const data = {
      name: this.countryForm.value.name,
    };

    this.service.country_addProduct(data).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        this.cdr.detectChanges();
        if(res.status===-1){
          Swal.fire({
            title: 'Not found!',
            text: 'Country information not found.',
            icon: 'error',
            confirmButtonText: 'OK'
          })
        }
        if (res.status == -2) {
          Swal.fire({
            title: 'Country Already Exists!',
            text: 'The country you are trying to add already exists.',
            icon: 'error',
            confirmButtonText: 'OK'
          })
        }
        if(res.status===-3){
          Swal.fire({
            title: 'missing country data!',
            text: 'Invalid or missing country data',
            icon: 'error',
            confirmButtonText: 'OK'
          })
        }
        if (res.status === 1) {
          Swal.fire({
            title: 'Success!',
            text: res.message || 'Country added successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.close(); // ✅ Only close after confirmation
          });
        }
      }

    });
  }


}
