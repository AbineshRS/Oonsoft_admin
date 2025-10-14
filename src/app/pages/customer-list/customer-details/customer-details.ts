import { ChangeDetectorRef, Component, EventEmitter, inject, Input, input, Output, SimpleChanges } from '@angular/core';
import { BackendapiService } from '../../../services/backendapi.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-details.html',
  styleUrl: './customer-details.css'
})
export class CustomerDetails {
  @Input() userId: string = '';
  constructor(private cdRef: ChangeDetectorRef) { }
  @Output() close = new EventEmitter<void>();
  private service = inject(BackendapiService);
  customerlist: any;
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'] && changes['userId'].currentValue) {
      this._Customerdetailsr(changes['userId'].currentValue);
    }
  }
 
  _Customerdetailsr(userId: string): void {
    this.service.customer_details(this.userId).subscribe({
      next: (res) => {
        this.customerlist = res.data;
        this.cdRef.detectChanges(); // 🔧 Force view update

      }
    })
  }
   onClose() {
    this.close.emit();
  }
}
