import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OonsoftUpdateProduct } from './oonsoft-update-product';

describe('OonsoftUpdateProduct', () => {
  let component: OonsoftUpdateProduct;
  let fixture: ComponentFixture<OonsoftUpdateProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OonsoftUpdateProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OonsoftUpdateProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
