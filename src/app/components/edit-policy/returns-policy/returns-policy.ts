import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import Swal from 'sweetalert2';
import { Header } from "../../header/header";
import { SideMenubar } from "../../side-menubar/side-menubar";
import { BackendapiService } from '../../../services/backendapi.service';

@Component({
  selector: 'app-returns-policy',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QuillModule, SideMenubar, Header],
  providers: [BackendapiService],
  templateUrl: './returns-policy.html',
  styleUrls: ['./returns-policy.css']
})
export class ReturnsPolicy implements OnInit {

  isSidebarOpen = true;
  isLoading = false;
  isEditMode = false;

  policyForm!: FormGroup;
  traccp_id: number | null = null;

  private backendService = inject(BackendapiService);

  constructor(private fb: FormBuilder, private backendapi: BackendapiService) { }

  ngOnInit(): void {
    this.policyForm = this.fb.group({
      description: ['', Validators.required]
    });

    this.loadReturnsPolicy();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.policyForm.enable();
    } else {
      this.policyForm.disable();
    }
  }

  loadReturnsPolicy() {
    this.isLoading = true;

    this.backendapi.gettraccp('returns-policy').subscribe({
      next: (res) => {
        this.isLoading = false;

        console.log('📦 Returns Policy API Response:', res);

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
          this.policyForm.patchValue({ description });
        } else {
          console.warn('⚠️ No traccp_description found for Returns Policy');
        }

        this.policyForm.disable();
        this.isEditMode = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('🚨 Error fetching Returns Policy:', err);
        Swal.fire('Error', 'Unable to load Returns Policy', 'error');
      }
    });
  }

  onSubmit() {
    if (this.policyForm.invalid) {
      Swal.fire('Validation Error', 'Please enter the Returns Policy description.', 'warning');
      return;
    }
    debugger
    this.isLoading = true;

    const payload = {
      traccp_code: 'returns-policy',
      traccp_description: this.policyForm.value.description
    };

    if (this.traccp_id) {
      this.backendapi.updatetraccp(this.traccp_id, payload).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.isEditMode = false;
          this.policyForm.disable();

          Swal.fire({
            title: 'Updated!',
            text: 'Returns Policy updated successfully!',
            icon: 'success',
            confirmButtonColor: '#3085d6'
          });
        },
        error: (err) => {
          this.isLoading = false;
          console.error('🚨 Update Error:', err);
          Swal.fire('Error', 'Something went wrong while updating Returns Policy.', 'error');
        }
      });
    } else {
      this.backendapi.posttraccp(payload).subscribe({
        next: (res: any) => {
          debugger
          this.isLoading = false;
          this.isEditMode = false;
          this.policyForm.disable();
          if (res.status === 1) {
            Swal.fire({
              title: 'Updated!',
              text: 'Returns Policy Updated successfully!',
              icon: 'success',
              confirmButtonColor: '#3085d6'
            });
          }
          if (res.status === 2) {
            Swal.fire({
              title: 'Created!',
              text: 'Returns Policy saved successfully!',
              icon: 'success',
              confirmButtonColor: '#3085d6'
            });
          }

        },
        error: (err) => {
          this.isLoading = false;
          console.error('🚨 Create Error:', err);
          Swal.fire('Error', 'Something went wrong while saving Returns Policy.', 'error');
        }
      });
    }
  }
}
