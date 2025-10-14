import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OonsoftProductList } from './oonsoft-product-list';

describe('OonsoftProductList', () => {
  let component: OonsoftProductList;
  let fixture: ComponentFixture<OonsoftProductList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OonsoftProductList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OonsoftProductList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
