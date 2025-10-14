import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutList } from './checkout-list';

describe('CheckoutList', () => {
  let component: CheckoutList;
  let fixture: ComponentFixture<CheckoutList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
