import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalProductListchekout } from './digital-product-listchekout';

describe('DigitalProductListchekout', () => {
  let component: DigitalProductListchekout;
  let fixture: ComponentFixture<DigitalProductListchekout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigitalProductListchekout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DigitalProductListchekout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
