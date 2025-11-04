import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellatioansAndBilling } from './cancellatioans-and-billing';

describe('CancellatioansAndBilling', () => {
  let component: CancellatioansAndBilling;
  let fixture: ComponentFixture<CancellatioansAndBilling>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancellatioansAndBilling]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancellatioansAndBilling);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
