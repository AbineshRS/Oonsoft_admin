import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalProductCheckoutView } from './physical-product-checkout-view';

describe('PhysicalProductCheckoutView', () => {
  let component: PhysicalProductCheckoutView;
  let fixture: ComponentFixture<PhysicalProductCheckoutView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhysicalProductCheckoutView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhysicalProductCheckoutView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
