import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostumSidenavComponent } from './costum-sidenav.component';

describe('CostumSidenavComponent', () => {
  let component: CostumSidenavComponent;
  let fixture: ComponentFixture<CostumSidenavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CostumSidenavComponent]
    });
    fixture = TestBed.createComponent(CostumSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
