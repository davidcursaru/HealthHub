import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightSidenavComponent } from './right-sidenav.component';

describe('RightSidenavComponent', () => {
  let component: RightSidenavComponent;
  let fixture: ComponentFixture<RightSidenavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RightSidenavComponent]
    });
    fixture = TestBed.createComponent(RightSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
