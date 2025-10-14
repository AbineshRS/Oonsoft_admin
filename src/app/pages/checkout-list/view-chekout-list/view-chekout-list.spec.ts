import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewChekoutList } from './view-chekout-list';

describe('ViewChekoutList', () => {
  let component: ViewChekoutList;
  let fixture: ComponentFixture<ViewChekoutList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewChekoutList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewChekoutList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
