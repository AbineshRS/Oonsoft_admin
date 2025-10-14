import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalProductList } from './digital-product-list';

describe('DigitalProductList', () => {
  let component: DigitalProductList;
  let fixture: ComponentFixture<DigitalProductList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigitalProductList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DigitalProductList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
