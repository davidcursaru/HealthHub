import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { map } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-sleep-tracker',
  templateUrl: './sleep-tracker.component.html',
  styleUrls: ['./sleep-tracker.component.css']
})
export class SleepTrackerComponent {

  sleepForm: any;


  private breakpointObserver = inject(BreakpointObserver);
  cards = this.breakpointObserver.observe([
    Breakpoints.Small,
    Breakpoints.Handset,
    Breakpoints.Medium,
    Breakpoints.Large,
    Breakpoints.XLarge
  ]).pipe(
    map(({ breakpoints }) => {
      if (breakpoints[Breakpoints.Small] || breakpoints[Breakpoints.Handset]) {
        return [
          { title: 'Schedule sleep hours ', cols: 1, rows: 3, route: '' },
          { title: 'Sleep score', cols: 1, rows: 3, route: '' },
          { title: 'Asleep time', cols: 1, rows: 8, route: '' },
          { title: 'Deep sleep', cols: 1, rows: 6, route: '' },
          { title: 'Awake', cols: 1, rows: 6, route: '' },
          { title: 'Regularity', cols: 1, rows: 6, route: '' },
          { columns: 1 }
        ];
      }
      else if (breakpoints[Breakpoints.Medium]) {
        return [
          { title: 'Schedule sleep hours ', cols: 1, rows: 20, route: '' },
          { title: 'Sleep score', cols: 1, rows: 20, route: '' },
          { title: 'Asleep time', cols: 1, rows: 20, route: '' },
          { title: 'Deep sleep', cols: 1, rows: 20, route: '' },
          { title: 'Awake', cols: 1, rows: 20, route: '' },
          { title: 'Regularity', cols: 1, rows: 43, route: '' },
          { title: 'Sleep phases', cols: 2, rows: 23, route: '' },
          { columns: 2 }
        ];
      }
      else if (breakpoints[Breakpoints.Large] || breakpoints[Breakpoints.XLarge]) {
        return [
          { title: 'Schedule sleep hours ', cols: 1, rows: 20, route: '' },
          { title: 'Sleep score', cols: 1, rows: 20, route: '' },
          { title: 'Asleep time', cols: 1, rows: 20, route: '' },
          { title: 'Deep sleep', cols: 1, rows: 20, route: '' },
          { title: 'Awake', cols: 1, rows: 20, route: '' },
          { title: 'Regularity', cols: 1, rows: 43, route: '' },
          { title: 'Sleep phases', cols: 2, rows: 23, route: '' },
          { columns: 3 }
        ];
      }

      return [
        { title: 'Schedule sleep hours ', cols: 1, rows: 3, route: '' },
        { title: 'Sleep score', cols: 1, rows: 3, route: '' },
        { title: 'Asleep time', cols: 1, rows: 8, route: '' },
        { title: 'Deep sleep', cols: 1, rows: 6, route: '' },
        { title: 'Awake', cols: 1, rows: 6, route: '' },
        { title: 'Regularity', cols: 1, rows: 6, route: '' },
        { columns: 1 }
      ];

    })
  );

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSavedTimes(); // Load saved times when the component initializes
  }

  initForm(): void {
    this.sleepForm = this.fb.group({
      sleepStartTime: [''], // Use '' to initialize the form control
      wakeUpTime: ['']
    });
  }

  loadSavedTimes(): void {
    // Load saved sleep times from your storage or API
    const savedSleepStartTime = localStorage.getItem('sleepStartTime');
    const savedWakeUpTime = localStorage.getItem('wakeUpTime');

    // Set form values if available
    if (savedSleepStartTime && savedWakeUpTime) {
      this.sleepForm.setValue({
        sleepStartTime: savedSleepStartTime,
        wakeUpTime: savedWakeUpTime
      });
    }
  }

  saveSleepTimes(): void {
    // Save sleep times to your storage or API
    localStorage.setItem('sleepStartTime', this.sleepForm.value.sleepStartTime);
    localStorage.setItem('wakeUpTime', this.sleepForm.value.wakeUpTime);
  }

}
