import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntensityBarComponent } from './intensity-bar.component';

describe('IntensityBarComponent', () => {
  let component: IntensityBarComponent;
  let fixture: ComponentFixture<IntensityBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IntensityBarComponent]
    });
    fixture = TestBed.createComponent(IntensityBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
