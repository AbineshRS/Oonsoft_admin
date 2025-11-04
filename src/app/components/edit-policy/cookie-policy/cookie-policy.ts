import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import Swal from 'sweetalert2';
import { Header } from "../../header/header";
import { SideMenubar } from "../../side-menubar/side-menubar";
import { BackendapiService } from '../../../services/backendapi.service';

@Component({
  selector: 'app-cookie-policy',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QuillModule, SideMenubar, Header],
  providers: [BackendapiService],
  templateUrl: './cookie-policy.html',
  styleUrls: ['./cookie-policy.css']
})
export class CookiePolicy implements OnInit {

  isSidebarOpen = true;
  isLoading = false;
  isEditMode = false;

  cookieForm!: FormGroup;
  traccp_id: number | null = null;

  private backendService = inject(BackendapiService);

  constructor(private fb: FormBuilder, private backendapi: BackendapiService) { }

  ngOnInit(): void {
    this.cookieForm = this.fb.group({
      description: ['', Validators.required]
    });

    this.loadCookiePolicy();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.cookieForm.enable();
    } else {
      this.cookieForm.disable();
    }
  }

  loadCookiePolicy() {
    this.isLoading = true;

    this.backendapi.gettraccp('cookie-policy').subscribe({
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
          this.cookieForm.patchValue({ description });
        } else {
          console.warn('⚠️ No traccp_description found in API response');
        }

        this.cookieForm.disable();
        this.isEditMode = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('🚨 Error fetching cookie policy:', err);
        Swal.fire('Error', 'Unable to load Cookie Policy', 'error');
      }
    });
  }

  onSubmit() {
    if (this.cookieForm.invalid) {
      Swal.fire('Validation Error', 'Please enter the Cookie Policy description.', 'warning');
      return;
    }

    this.isLoading = true;

    const payload = {
      traccp_code: 'cookie-policy',
      traccp_description: this.cookieForm.value.description
    };

    if (this.traccp_id) {
      this.backendapi.updatetraccp(this.traccp_id, payload).subscribe({
        next: () => {
          this.isLoading = false;
          this.isEditMode = false;
          this.cookieForm.disable();

          Swal.fire({
            title: 'Updated!',
            text: 'Cookie Policy updated successfully!',
            icon: 'success',
            confirmButtonColor: '#3085d6'
          });
        },
        error: (err) => {
          this.isLoading = false;
          console.error('🚨 Update Error:', err);
          Swal.fire('Error', 'Something went wrong while updating Cookie Policy.', 'error');
        }
      });
    } else {
      this.backendapi.posttraccp(payload).subscribe({
        next: () => {
          this.isLoading = false;
          this.isEditMode = false;
          this.cookieForm.disable();

          Swal.fire({
            title: 'Created!',
            text: 'Cookie Policy saved successfully!',
            icon: 'success',
            confirmButtonColor: '#3085d6'
          });
        },
        error: (err) => {
          this.isLoading = false;
          console.error('🚨 Create Error:', err);
          Swal.fire('Error', 'Something went wrong while saving Cookie Policy.', 'error');
        }
      });
    }
  }
}
