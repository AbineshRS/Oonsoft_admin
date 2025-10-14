import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePhysicalProduct } from './update-physical-product';

describe('UpdatePhysicalProduct', () => {
  let component: UpdatePhysicalProduct;
  let fixture: ComponentFixture<UpdatePhysicalProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePhysicalProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePhysicalProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
