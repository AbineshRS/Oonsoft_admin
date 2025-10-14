import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigialProductChekoutView } from './digial-product-chekout-view';

describe('DigialProductChekoutView', () => {
  let component: DigialProductChekoutView;
  let fixture: ComponentFixture<DigialProductChekoutView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigialProductChekoutView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DigialProductChekoutView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
