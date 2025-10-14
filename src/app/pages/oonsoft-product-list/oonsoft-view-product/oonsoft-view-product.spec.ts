import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OonsoftViewProduct } from './oonsoft-view-product';

describe('OonsoftViewProduct', () => {
  let component: OonsoftViewProduct;
  let fixture: ComponentFixture<OonsoftViewProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OonsoftViewProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OonsoftViewProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
