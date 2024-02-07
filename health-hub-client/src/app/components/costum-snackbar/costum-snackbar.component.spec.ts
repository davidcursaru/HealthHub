import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostumSnackbarComponent } from './costum-snackbar.component';

describe('CostumSnackbarComponent', () => {
  let component: CostumSnackbarComponent;
  let fixture: ComponentFixture<CostumSnackbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CostumSnackbarComponent]
    });
    fixture = TestBed.createComponent(CostumSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
