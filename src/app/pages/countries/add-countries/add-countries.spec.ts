import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCountries } from './add-countries';

describe('AddCountries', () => {
  let component: AddCountries;
  let fixture: ComponentFixture<AddCountries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCountries]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCountries);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
