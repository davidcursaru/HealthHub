import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { map } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-sleep-tracker',
  templateUrl: './sleep-tracker.component.html',
  styleUrls: ['./sleep-tracker.component.css']
})
export class SleepTrackerComponent {

  sleepForm: any;
  deepSleepPercentage: number = 15;
  score: number = 90;
  percentageBar: number = 30;
  sleepGoalHrs: any;
  sleepGoalMins: any;
  progressValue: number = 40; // Example value, replace with your actual value
  progressMessage: any;
  progressMessageColor: any;

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
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadSavedTimes();
    this. sleepGoalHrs = localStorage.getItem("sleepGoalHrs");
    this. sleepGoalMins = localStorage.getItem("sleepGoalMins");
  }

  initForm(): void {
    this.sleepForm = this.fb.group({
      sleepStartTime: [''],
      wakeUpTime: ['']
    });
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

  getCircleColor(): string {
    if (this.score <= 60) {
      return 'red';
    } else if (this.score > 60 && this.score <= 79) {
      return '#E5E500';
    } else if (this.score >= 80 && this.score <= 89) {
      return '#BBE166';
    } else {
      return 'green';
    }
  }

  getMessage(): { title: string, message: string } {
    if (this.score <= 60) {
      return { title: 'Accord Care', message: 'Consider adjusting your sleep routine' };
    } else if (this.score > 60 && this.score <= 79) {
      return { title: 'Satisfying', message: 'Congratulations! You have a satisfying sleep score' };
    } else if (this.score >= 80 && this.score <= 89) {
      return { title: 'Good', message: 'Great job! Your sleep score reflects good sleep quality' };
    }
    else {
      return { title: 'Optimal', message: 'Fantastic job! Your sleep score reflects excellent sleep quality' };
    }
  }

  updateProgressMessage(value: number) {
    if (value < 70) {
        this.progressMessage = 'Accord Care';
        this.progressMessageColor = 'red';
    } else if (value >= 70 && value <= 89) {
        this.progressMessage = 'Good';
        this.progressMessageColor = '#5CB85C'; // Lighter green
    } else {
        this.progressMessage = 'Optimal';
        this.progressMessageColor = '#4cae4c'; // Darker green
    }

    return [this.progressMessage, this.progressMessageColor];
}

// Call this function whenever the progress value changes
onProgressChange(value: number): void {
    this.progressValue = value;
    this.updateProgressMessage(value);
}

}
