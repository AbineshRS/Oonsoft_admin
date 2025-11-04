import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import Swal from 'sweetalert2';
import { Header } from "../../header/header";
import { SideMenubar } from "../../side-menubar/side-menubar";
import { BackendapiService } from '../../../services/backendapi.service';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QuillModule, SideMenubar, Header],
  providers: [BackendapiService],
  templateUrl: './terms-of-service.html',
  styleUrls: ['./terms-of-service.css']
})
export class TermsOfService implements OnInit {

  isSidebarOpen = true;
  isLoading = false;
  isEditMode = false;

  termsForm!: FormGroup;
  traccp_id: number | null = null;

  private backendService = inject(BackendapiService);

  constructor(private fb: FormBuilder, private backendapi: BackendapiService) { }

  ngOnInit(): void {
    this.termsForm = this.fb.group({
      description: ['', Validators.required]
    });

    this.loadTermsOfService();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;

    if (this.isEditMode) {
      this.termsForm.enable();
    } else {
      this.termsForm.disable();
    }
  }

  loadTermsOfService() {
    this.isLoading = true;

    this.backendapi.gettraccp('terms-of-service').subscribe({
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
          this.termsForm.patchValue({ description });
        } else {
          console.warn('⚠️ No traccp_description found in API response');
        }

        this.termsForm.disable();
        this.isEditMode = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('🚨 Error fetching terms of service:', err);
        Swal.fire('Error', 'Unable to load Terms of Service', 'error');
      }
    });
  }

  onSubmit() {
    if (this.termsForm.invalid) {
      Swal.fire('Validation Error', 'Please enter the Terms of Service description.', 'warning');
      return;
    }

    this.isLoading = true;

    const payload = {
      traccp_code: 'terms-of-service',
      traccp_description: this.termsForm.value.description
    };

    if (this.traccp_id) {
      this.backendapi.updatetraccp(this.traccp_id, payload).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.isEditMode = false;
          this.termsForm.disable();

          Swal.fire({
            title: 'Updated!',
            text: 'Terms of Service updated successfully!',
            icon: 'success',
            confirmButtonColor: '#3085d6'
          });
        },
        error: (err) => {
          this.isLoading = false;
          console.error('🚨 Update Error:', err);
          Swal.fire('Error', 'Something went wrong while updating Terms of Service.', 'error');
        }
      });
    } else {
      this.backendapi.posttraccp(payload).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.isEditMode = false;
          this.termsForm.disable();

          Swal.fire({
            title: 'Created!',
            text: 'Terms of Service saved successfully!',
            icon: 'success',
            confirmButtonColor: '#3085d6'
          });
        },
        error: (err) => {
          this.isLoading = false;
          console.error('🚨 Create Error:', err);
          Swal.fire('Error', 'Something went wrong while saving Terms of Service.', 'error');
        }
      });
    }
  }
}