import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnsPolicy } from './returns-policy';

describe('ReturnsPolicy', () => {
  let component: ReturnsPolicy;
  let fixture: ComponentFixture<ReturnsPolicy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnsPolicy]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnsPolicy);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
