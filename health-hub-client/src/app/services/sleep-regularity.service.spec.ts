import { TestBed } from '@angular/core/testing';

import { SleepRegularityService } from './sleep-regularity.service';

describe('SleepRegularityService', () => {
  let service: SleepRegularityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SleepRegularityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
