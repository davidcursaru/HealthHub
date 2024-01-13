import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwakeBarComponent } from './awake-bar.component';

describe('AwakeBarComponent', () => {
  let component: AwakeBarComponent;
  let fixture: ComponentFixture<AwakeBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AwakeBarComponent]
    });
    fixture = TestBed.createComponent(AwakeBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
