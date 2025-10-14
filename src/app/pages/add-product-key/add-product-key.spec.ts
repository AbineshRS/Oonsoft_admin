import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductKey } from './add-product-key';

describe('AddProductKey', () => {
  let component: AddProductKey;
  let fixture: ComponentFixture<AddProductKey>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProductKey]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProductKey);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
