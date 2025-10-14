import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideMenubar } from './side-menubar';

describe('SideMenubar', () => {
  let component: SideMenubar;
  let fixture: ComponentFixture<SideMenubar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideMenubar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideMenubar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
