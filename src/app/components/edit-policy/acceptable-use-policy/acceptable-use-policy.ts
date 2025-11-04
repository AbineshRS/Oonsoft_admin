import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import Swal from 'sweetalert2';
import { Header } from "../../header/header";
import { SideMenubar } from "../../side-menubar/side-menubar";
import { BackendapiService } from '../../../services/backendapi.service';

@Component({
  selector: 'app-acceptable-use-policy',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QuillModule, Header, SideMenubar],
  providers: [BackendapiService],
  templateUrl: './acceptable-use-policy.html',
  styleUrls: ['./acceptable-use-policy.css']
})
export class AcceptableUsePolicy implements OnInit {

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

    this.loadAcceptableUsePolicy();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) this.policyForm.enable();
    else this.policyForm.disable();
  }

  loadAcceptableUsePolicy() {
    this.isLoading = true;

    this.backendapi.gettraccp('acceptable-use-policy').subscribe({
      next: (res) => {
        this.isLoading = false;

        console.log('📦 AUP API Response:', res);
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

        if (description) this.policyForm.patchValue({ description });
        else console.warn('⚠️ No traccp_description found in API response');

        this.policyForm.disable();
        this.isEditMode = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('🚨 Error fetching Acceptable Use Policy:', err);
        Swal.fire('Error', 'Unable to load Acceptable Use Policy', 'error');
      }
    });
  }

  onSubmit() {
    if (this.policyForm.invalid) {
      Swal.fire('Validation Error', 'Please enter the Acceptable Use Policy description.', 'warning');
      return;
    }

    this.isLoading = true;

    const payload = {
      traccp_code: 'acceptable-use-policy',
      traccp_description: this.policyForm.value.description
    };

    if (this.traccp_id) {
      this.backendapi.updatetraccp(this.traccp_id, payload).subscribe({
        next: () => {
          this.isLoading = false;
          this.isEditMode = false;
          this.policyForm.disable();
          Swal.fire('Updated!', 'Acceptable Use Policy updated successfully!', 'success');
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
          this.policyForm.disable();
          Swal.fire('Created!', 'Acceptable Use Policy saved successfully!', 'success');
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
