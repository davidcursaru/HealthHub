import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaloriesComponent } from './calories.component';

describe('CaloriesComponent', () => {
  let component: CaloriesComponent;
  let fixture: ComponentFixture<CaloriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CaloriesComponent]
    });
    fixture = TestBed.createComponent(CaloriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
