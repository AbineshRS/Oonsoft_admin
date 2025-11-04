import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import Swal from 'sweetalert2';
import { Header } from "../../header/header";
import { SideMenubar } from "../../side-menubar/side-menubar";
import { BackendapiService } from '../../../services/backendapi.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cancellatioans-and-billing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QuillModule, SideMenubar, Header],
  providers: [BackendapiService],
  templateUrl: './cancellatioans-and-billing.html',
  styleUrls: ['./cancellatioans-and-billing.css']
})
export class CancellatioansAndBilling implements OnInit {

  isSidebarOpen = true;
  isLoading = false;
  isEditMode = false;

  billingForm!: FormGroup;
  traccp_id: number | null = null;

  private backendService = inject(BackendapiService);

  constructor(private fb: FormBuilder, private backendapi: BackendapiService) { }

  ngOnInit(): void {
    this.billingForm = this.fb.group({
      description: ['', Validators.required]
    });

    this.loadBillingPolicy();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;

    if (this.isEditMode) {
      this.billingForm.enable();
    } else {
      this.billingForm.disable();
    }
  }

  loadBillingPolicy() {
    this.isLoading = true;

    this.backendapi.gettraccp('cancellations-and-billing').subscribe({
      next: (res) => {
        this.isLoading = false;
        console.log('📦 API Response:', res);

        let description = '';

        if (res && res.data) {
          if (res.data.traccp_description) description = res.data.traccp_description;
          if (res.data.traccp_id) this.traccp_id = res.data.traccp_id;
        } else if (Array.isArray(res) && res.length > 0) {
          description = res[0].traccp_description;
          this.traccp_id = res[0].traccp_id;
        } else if (res.traccp_description) {
          description = res.traccp_description;
          this.traccp_id = res.traccp_id;
        }

        if (description) {
          this.billingForm.patchValue({ description });
        } else {
          console.warn('⚠️ No traccp_description found in API response');
        }

        this.billingForm.disable();
        this.isEditMode = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('🚨 Error fetching data:', err);
        Swal.fire('Error', 'Unable to load Cancellations & Billing policy', 'error');
      }
    });
  }

  onSubmit() {
    if (this.billingForm.invalid) {
      Swal.fire('Validation Error', 'Please enter the content.', 'warning');
      return;
    }

    this.isLoading = true;

    const payload = {
      traccp_code: 'cancellations-and-billing',
      traccp_description: this.billingForm.value.description
    };

    if (this.traccp_id) {
      this.backendapi.updatetraccp(this.traccp_id, payload).subscribe({
        next: () => {
          this.isLoading = false;
          this.isEditMode = false;
          this.billingForm.disable();
          Swal.fire({
            title: 'Updated!',
            text: 'Cancellations & Billing updated successfully!',
            icon: 'success',
            confirmButtonColor: '#3085d6'
          });
        },
        error: (err) => {
          this.isLoading = false;
          console.error('🚨 Update Error:', err);
          Swal.fire('Error', 'Something went wrong while updating.', 'error');
        }
      });
    } else {
      this.backendapi.posttraccp(payload).subscribe({
        next: () => {
          this.isLoading = false;
          this.isEditMode = false;
          this.billingForm.disable();
          Swal.fire({
            title: 'Created!',
            text: 'Cancellations & Billing saved successfully!',
            icon: 'success',
            confirmButtonColor: '#3085d6'
          });
        },
        error: (err) => {
          this.isLoading = false;
          console.error('🚨 Create Error:', err);
          Swal.fire('Error', 'Something went wrong while saving.', 'error');
        }
      });
    }
  }
}
