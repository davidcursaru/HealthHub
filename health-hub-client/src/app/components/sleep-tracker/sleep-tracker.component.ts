import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { interval, map } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GoogleAPIService } from 'src/app/services/google-api.service';


@Component({
  selector: 'app-sleep-tracker',
  templateUrl: './sleep-tracker.component.html',
  styleUrls: ['./sleep-tracker.component.css'],

})
export class SleepTrackerComponent {
  userId: any;
  sleepForm: any;
  deepSleepPercentage: any;
  score: any;

  sleepPhasesDictionary: { [key: number]: string } = {
    1: 'Awake',
    4: 'Light sleep',
    5: 'Deep sleep'
  };

  startTimeMillis: number = 0;
  endTimeMillis: number = 0;
  sleepStartTimeNanos: any;
  sleepEndTimeNanos: any;

  //For asleep card
  sleepGoalHrs: any;
  sleepGoalMins: any;
  sleepHours: any;
  asleepTimePercentage: any;
  asleepProgressMessage: any;
  asleepProgressMessageColor: any;

  numberOfAwake: any;


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
          { title: 'Schedule sleep hours ', cols: 1, rows: 20, route: '' },
          { title: 'Sleep score', cols: 1, rows: 20, route: '' },
          { title: 'Asleep time', cols: 1, rows: 20, route: '' },
          { title: 'Deep sleep', cols: 1, rows: 20, route: '' },
          { title: 'Awake', cols: 1, rows: 20, route: '' },
          { title: 'Regularity', cols: 1, rows: 30, route: '' },
          { title: 'Sleep phases', cols: 1, rows: 20, route: '' },
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
          { title: 'Regularity', cols: 1, rows: 30, route: '' },
          { title: 'Sleep phases', cols: 2, rows: 20, route: '' },
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
          { title: 'Regularity', cols: 1, rows: 30, route: '' },
          { title: 'Sleep phases', cols: 2, rows: 20, route: '' },
          { columns: 3 }
        ];
      }

      return [
        { title: 'Schedule sleep hours ', cols: 1, rows: 20, route: '' },
        { title: 'Sleep score', cols: 1, rows: 20, route: '' },
        { title: 'Asleep time', cols: 1, rows: 20, route: '' },
        { title: 'Deep sleep', cols: 1, rows: 20, route: '' },
        { title: 'Awake', cols: 1, rows: 20, route: '' },
        { title: 'Regularity', cols: 1, rows: 30, route: '' },
        { title: 'Sleep phases', cols: 1, rows: 20, route: '' },
        { columns: 1 }
      ];

    })
  );

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private googleAPIService: GoogleAPIService
  ) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem("userId");

    this.setTimeRangeMillis();

    this.initForm();
    this.loadSavedTimes();
    this.sleepGoalHrs = localStorage.getItem("sleepGoalHrs");
    this.sleepGoalMins = localStorage.getItem("sleepGoalMins");
    this.getSleepPhases();

    this.sleepStartTimeNanos = localStorage.getItem("SleepStartTimeNanos");
    this.sleepEndTimeNanos = localStorage.getItem("SleepEndTimeNanos");
    interval(100).subscribe(() => {
      this.sleepHours = this.calculateSleepDuration(this.sleepStartTimeNanos, this.sleepEndTimeNanos);
      this.asleepTimePercentage = this.calculatePercentage((this.sleepHours.hours * 60) + this.sleepHours.minutes, (Number(this.sleepGoalHrs) * 60) + Number(this.sleepGoalMins))
    });

  }

  initForm(): void {
    this.sleepForm = this.fb.group({
      sleepStartTime: [''],
      wakeUpTime: ['']
    });
  }

  calculatePercentage(part: number, whole: number): number {
    if (whole === 0) {
      return 0;
    }
    const p = (part / whole) * 100;
    return Math.floor(p);
  }

  setTimeRangeMillis(): void {
    const now = new Date();
    this.endTimeMillis = Date.now();
    now.setHours(0, 0, 0, 0);
    this.startTimeMillis = now.getTime();
  }

  getSleepPhases(): void {
    this.googleAPIService.getSleepPhases(this.userId, this.startTimeMillis, this.endTimeMillis)
      .subscribe(
        (data) => {
          // Check if 'bucket' array exists and has elements
          if (data && data.bucket && data.bucket.length > 0) {
            const firstObject = data.bucket[0].dataset[0].point[0];
            const lastObject = data.bucket[data.bucket.length - 1].dataset[0].point[data.bucket[data.bucket.length - 1].dataset[0].point.length - 1];

            this.sleepStartTimeNanos = firstObject.startTimeNanos;
            this.sleepEndTimeNanos = lastObject.endTimeNanos;
            localStorage.setItem("SleepStartTimeNanos", this.sleepStartTimeNanos.toString());
            localStorage.setItem("SleepEndTimeNanos", this.sleepEndTimeNanos.toString());
          } else {
            console.warn('No data available in the response.');
            this.sleepEndTimeNanos = 0;
            this.sleepStartTimeNanos = 0;
            localStorage.setItem("SleepStartTimeNanos", this.sleepStartTimeNanos.toString());
            localStorage.setItem("SleepEndTimeNanos", this.sleepEndTimeNanos.toString());
          }

        },
        (error) => {
          console.error('Error fetching sleep phases data:', error);
          this.sleepEndTimeNanos = 0;
          this.sleepStartTimeNanos = 0;
          localStorage.setItem("SleepStartTimeNanos", this.sleepStartTimeNanos.toString());
          localStorage.setItem("SleepEndTimeNanos", this.sleepEndTimeNanos.toString());
        }
      );
  }

  calculateSleepDuration(startSleepTimeNanos: number, wakeUpTimeNanos: number): { hours: number, minutes: number } {
    const diffMillis = (wakeUpTimeNanos - startSleepTimeNanos) / 1e6; // Convert nanoseconds to milliseconds
    const diffHours = Math.floor(diffMillis / (60 * 60 * 1000)); // Calculate hours
    const diffMinutes = Math.floor((diffMillis % (60 * 60 * 1000)) / (60 * 1000)); // Calculate remaining minutes

    return {
      hours: diffHours,
      minutes: diffMinutes,
    };
  }

  loadSavedTimes(): void {
    const savedSleepStartTime = localStorage.getItem('sleepStartTime');
    const savedWakeUpTime = localStorage.getItem('wakeUpTime');

    if (savedSleepStartTime && savedWakeUpTime) {
      this.sleepForm.setValue({
        sleepStartTime: savedSleepStartTime,
        wakeUpTime: savedWakeUpTime
      });
    }
  }



  saveSleepTimes(): void {
    localStorage.setItem('sleepStartTime', this.sleepForm.value.sleepStartTime);
    localStorage.setItem('wakeUpTime', this.sleepForm.value.wakeUpTime);
    const sleepStartTime: string = this.sleepForm.value.sleepStartTime;
    const wakeUpTime: string = this.sleepForm.value.wakeUpTime;

    // Check if both sleepStartTime and wakeUpTime are provided
    if (sleepStartTime && wakeUpTime) {
      const currentDate = new Date();
      const sleepStartDate = new Date(currentDate.toISOString().split('T')[0] + 'T' + sleepStartTime);
      const wakeUpDate = new Date(sleepStartDate.toISOString().split('T')[0] + 'T' + wakeUpTime);
      wakeUpDate.setDate(wakeUpDate.getDate() + 1);
      const newDiffMs = wakeUpDate.valueOf() - sleepStartDate.valueOf();

      this.sleepGoalHrs = Math.floor((newDiffMs % 86400000) / 3600000);
      this.sleepGoalMins = Math.round(((newDiffMs % 86400000) % 3600000) / 60000);
      localStorage.setItem("sleepGoalHrs", this.sleepGoalHrs);
      localStorage.setItem("sleepGoalMins", this.sleepGoalMins);

      this.snackBar.open('Sleep hours were set successfully', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snackbar-success'],
      });
    } else {
      this.snackBar.open('Please provide both sleep start and wake up times', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snackbar-error'],
      });
    }
  }

  getCircleColor(score: any): string {
    if (score <= 60) {
      return 'red';
    } else if (score > 60 && score <= 79) {
      return '#E5E500';
    } else if (score >= 80 && score <= 89) {
      return '#BBE166';
    } else if (score > 89) {
      return 'green';
    }

    return 'red';
  }

  getMessage(): { score: string, title: string, message: string } {
    if (this.score <= 60) {
      return { score: this.score.toString(), title: 'Accord Care', message: 'Consider adjusting your sleep routine' };
    } else if (this.score > 60 && this.score <= 79) {
      return { score: this.score.toString(), title: 'Satisfying', message: 'Congratulations! You have a satisfying sleep score' };
    } else if (this.score >= 80 && this.score <= 89) {
      return { score: this.score.toString(), title: 'Good', message: 'Great job! Your sleep score reflects good sleep quality' };
    }
    else if (this.score > 89) {
      return { score: this.score.toString(), title: 'Optimal', message: 'Fantastic job! Your sleep score reflects excellent sleep quality' };
    }
    return { score: '0', title: 'No sleep data available', message: 'Log in with Google account to acces Google Fit data' };
  }

  updateAsleepProgressMessage(value: number): { title: string, color: string } {
    if (value < 70) {
      return { title: 'Accord Care', color: 'red' };
    } else if (value >= 70 && value <= 89) {
      return { title: 'Good', color: '#5CB85C' };
    } else if (value > 89) {
      return { title: 'Optimal', color: '#4cae4c' };
    }
    return { title: 'No sleep data available', color: 'black' };
  }

}
