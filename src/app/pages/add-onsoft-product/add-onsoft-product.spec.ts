import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOnsoftProduct } from './add-onsoft-product';

describe('AddOnsoftProduct', () => {
  let component: AddOnsoftProduct;
  let fixture: ComponentFixture<AddOnsoftProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOnsoftProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOnsoftProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
