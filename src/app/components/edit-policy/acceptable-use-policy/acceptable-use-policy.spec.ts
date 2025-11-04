import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptableUsePolicy } from './acceptable-use-policy';

describe('AcceptableUsePolicy', () => {
  let component: AcceptableUsePolicy;
  let fixture: ComponentFixture<AcceptableUsePolicy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceptableUsePolicy]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptableUsePolicy);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
