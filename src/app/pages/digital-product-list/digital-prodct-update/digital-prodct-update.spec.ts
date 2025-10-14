import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalProdctUpdate } from './digital-prodct-update';

describe('DigitalProdctUpdate', () => {
  let component: DigitalProdctUpdate;
  let fixture: ComponentFixture<DigitalProdctUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigitalProdctUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DigitalProdctUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
