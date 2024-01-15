import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { interval, map } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GoogleAPIService } from 'src/app/services/google-api.service';
import { SleepData } from 'src/app/interfaces/sleepPhases.interface';
import { SleepRegularityService } from 'src/app/services/sleep-regularity.service';


@Component({
  selector: 'app-sleep-tracker',
  templateUrl: './sleep-tracker.component.html',
  styleUrls: ['./sleep-tracker.component.css'],

})
export class SleepTrackerComponent {
  userId: any;
  sleepForm: any;

  timezoneOffset = new Date().getTimezoneOffset();
  currentDate = new Date();
  // Calculate the date of 7 days ago
  sevenDaysAgoDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() - 7, 0, 0 - this.timezoneOffset, 0);
  startDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate(), 0, 0 - this.timezoneOffset, 0);
  endDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate(), 23, 59 - this.timezoneOffset, 59);
  isoDateString1 = this.sevenDaysAgoDate.toISOString();
  isoDateString2 = this.endDate.toISOString();

  startTimeMillis: number = 0;
  endTimeMillis: number = 0;
  sleepStartTimeNanos: any;
  sleepEndTimeNanos: any;

  //for score card
  score: any;

  sleepData: SleepData | undefined;
  deepSleepTime: { hours: number, minutes: number } = { hours: 0, minutes: 0 };
  deepSleepHours: any;
  deepSleepMinutes: any;

  //for deep sleep card
  sleepPhasesDictionary: { [key: number]: string } = {
    1: 'Awake',
    4: 'Light sleep',
    5: 'Deep sleep'
  };
  deepSleepPercentage: any;


  //For asleep card
  sleepGoalHrs: any;
  sleepGoalMins: any;
  sleepHours: any;
  totalSleepMinutes: any;
  asleepTimePercentage: any;
  asleepProgressMessage: any;
  asleepProgressMessageColor: any;

  //for awake card
  awakeCounter: any;
  awakeHours: any;
  awakeMinutes: any;

  //for regularity card
  regularityScore: any;
  averageSleepStartTime: any;
  averageWakeUpTime: any;
  averageSleepDuration: any;


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
          { title: 'Regularity', cols: 1, rows: 33, route: '' },
          { title: 'Sleep phases', cols: 2, rows: 23, route: '' },
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
    private googleAPIService: GoogleAPIService,
    private sleepRegularityService: SleepRegularityService
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
    // this.awakeCounter = Number(localStorage.getItem("awakeCounter"));
    // this.deepSleepHours = localStorage.getItem("deepSleepHours");
    // this.deepSleepMinutes = localStorage.getItem("deepSleepMinutes");
    // this.deepSleepPercentage = localStorage.getItem("deepSleepPercentage");

    interval(100).subscribe(() => {
      this.sleepHours = this.calculateSleepDuration(this.sleepStartTimeNanos, this.sleepEndTimeNanos);
      this.totalSleepMinutes = (this.sleepHours.hours * 60) + this.sleepHours.minutes;
      this.asleepTimePercentage = this.calculatePercentage(this.totalSleepMinutes, (Number(this.sleepGoalHrs) * 60) + Number(this.sleepGoalMins))
    });

    this.googleAPIService.getSession(this.userId, this.isoDateString1, this.isoDateString2).subscribe(
      (data) => {
        const sleepDataRegularity = [];

        for (const session of data.session) {
          if (session.name === 'Sleep') {
            const sleepEntry = {
              sleepStartTimeMillis: parseInt(session.startTimeMillis),
              wakeUpTimeMillis: parseInt(session.endTimeMillis),
            };

            sleepDataRegularity.push(sleepEntry);
          }
        }

        if (sleepDataRegularity.length > 2) {
          // Calculate and display the regularity score
          this.regularityScore = this.sleepRegularityService.calculateSRI(sleepDataRegularity);
          // Calculate and display the average sleep start time
          this.averageSleepStartTime = this.sleepRegularityService.calculateAverageSleepStartTime(sleepDataRegularity);
          // Calculate and display the average wake-up time
          this.averageWakeUpTime = this.sleepRegularityService.calculateAverageWakeUpTime(sleepDataRegularity);
        }
        else if(sleepDataRegularity.length != 0)
        {
          this.regularityScore = 0;
          this.averageSleepStartTime = this.sleepRegularityService.calculateAverageSleepStartTime(sleepDataRegularity);
          // Calculate and display the average wake-up time
          this.averageWakeUpTime = this.sleepRegularityService.calculateAverageWakeUpTime(sleepDataRegularity);
        }
        else{
          this.averageSleepStartTime = 'No data';
          this.averageWakeUpTime = 'No data';
        }

      },
      (error) => {
        console.error('Error fetching session data:', error);

      }
    );

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
          if (data && data.bucket && data.bucket.length > 0 && data.bucket[0].dataset[0].point.length > 0) {
            const firstObject = data.bucket[0].dataset[0].point[0];
            const lastObject = data.bucket[data.bucket.length - 1].dataset[0].point[data.bucket[data.bucket.length - 1].dataset[0].point.length - 1];

            this.sleepStartTimeNanos = firstObject.startTimeNanos;
            this.sleepEndTimeNanos = lastObject.endTimeNanos;
            localStorage.setItem("SleepStartTimeNanos", this.sleepStartTimeNanos.toString());
            localStorage.setItem("SleepEndTimeNanos", this.sleepEndTimeNanos.toString());
            this.sleepHours = this.calculateSleepDuration(this.sleepStartTimeNanos, this.sleepEndTimeNanos);
            this.totalSleepMinutes = (this.sleepHours.hours * 60) + this.sleepHours.minutes;
            this.calculateSleepPhaseTime(data, 5);
            this.calculateSleepPhaseTime(data, 1);
            this.score = this.calculateSleepScore(this.totalSleepMinutes, this.deepSleepMinutes, this.awakeCounter);

          } else {
            console.warn('No sleep data available in the response.');
            this.sleepStartTimeNanos = 0;
            this.sleepEndTimeNanos = 0;
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

  calculateSleepPhaseTime(sleepData: SleepData, sleepPhase: number): void {

    // Initialize deep sleep time
    let totalDeepSleepNanos = 0;
    let counter = 0;

    sleepData.bucket.forEach(bucket => {
      if (bucket.dataset && bucket.dataset.length > 0) {
        bucket.dataset.forEach(dataset => {
          if (dataset.point && dataset.point.length > 0) {
            dataset.point.forEach(point => {
              if (point.value && point.value.length > 0 && point.value[0].intVal === sleepPhase) {
                // Calculate deep sleep time for each point
                totalDeepSleepNanos += (Number(point.endTimeNanos) - Number(point.startTimeNanos));
                if (sleepPhase === 1) {
                  counter += 1;
                }

              }
            });
          }
        });
      }
    });

    // Convert nanoseconds to hours and minutes
    const totalDeepSleepMinutes = Math.round(totalDeepSleepNanos / (60 * 1e9));
    if (sleepPhase === 5) {
      this.deepSleepPercentage = this.calculatePercentage(totalDeepSleepMinutes, this.totalSleepMinutes);
      this.deepSleepHours = Math.floor(totalDeepSleepMinutes / 60);
      this.deepSleepMinutes = totalDeepSleepMinutes % 60;

      localStorage.setItem("deepSleepPercentage", this.deepSleepPercentage);
      localStorage.setItem("deepSleepHours", this.deepSleepHours);
      localStorage.setItem("deepSleepMinutes", this.deepSleepMinutes);
    }
    else if (sleepPhase === 1) {
      this.awakeHours = Math.floor(totalDeepSleepMinutes / 60);
      this.awakeMinutes = totalDeepSleepMinutes % 60;
      this.awakeCounter = counter;
    }

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

  getRegularityMessage(): { score: string, title: string, message: string } {
    if (this.regularityScore <= 60) {
      return { score: this.regularityScore.toString(), title: 'Accord Care', message: '' };
    } else if (this.regularityScore > 60 && this.score <= 79) {
      return { score: this.regularityScore.toString(), title: 'Satisfying', message: '' };
    } else if (this.regularityScore >= 80 && this.score <= 89) {
      return { score: this.regularityScore.toString(), title: 'Good', message: '' };
    }
    else if (this.regularityScore > 89) {
      return { score: this.regularityScore.toString(), title: 'Optimal', message: '' };
    }
    if(this.regularityScore == 0)
    {
      return { score: '0', title: 'Not enough sleep data available', message: 'Track at least 3 sleep sessions with your smartwatch.' };
    }
    return { score: '0', title: 'No sleep data available', message: 'Log in with Google account to access Google Fit data' };
  }

  updateAsleepProgressMessage(value: number): { title: string, color: string } {
    if (value < 70 && value > 1) {
      return { title: 'Accord Care', color: 'red' };
    } else if (value >= 70 && value <= 89) {
      return { title: 'Good', color: '#5CB85C' };
    } else if (value > 89) {
      return { title: 'Optimal', color: 'green' };
    }
    return { title: 'No sleep data available', color: 'black' };
  }

  calculateSleepScore(totalSleepMinutes: number, deepSleepMinutes: number, numberOfAwakeTimes: number): number {
    // Define weights for each factor
    const totalSleepWeight = 0.85;
    const deepSleepWeight = 0.6;
    const awakeTimesWeight = 0.035;
    let weightedSum = 0

    // Normalize values (you can define your own normalization logic)
    const normalizedTotalSleep = this.normalize(totalSleepMinutes, 8 * 60); // Assuming 8 hours as ideal sleep
    const normalizedDeepSleep = this.normalize(deepSleepMinutes, totalSleepMinutes);
    const normalizedAwakeTimes = (awakeTimesWeight * numberOfAwakeTimes); // Assuming fewer awakenings are better

    // Calculate the weighted sum
    if (normalizedAwakeTimes > 0) {
      weightedSum = (totalSleepWeight * normalizedTotalSleep) + (deepSleepWeight * normalizedDeepSleep) - normalizedAwakeTimes;
    }
    else {
      weightedSum = (totalSleepWeight * normalizedTotalSleep) + (deepSleepWeight * normalizedDeepSleep) + 0.1;
    }

    // Adjust the score based on deep sleep percentage
    const deepSleepPercentage = (deepSleepMinutes / totalSleepMinutes) * 100;

    if (deepSleepPercentage > 35) {
      // Subtract from the score for deep sleep percentage greater than 35
      weightedSum -= (deepSleepPercentage - 35) * 0.01;
    } else if (deepSleepPercentage < 10) {
      // Subtract from the score for deep sleep percentage less than 10
      weightedSum -= (10 - deepSleepPercentage) * 0.01;
    }

    // You can adjust the range and scale based on your preferences
    const sleepScore = Math.round(weightedSum * 100);

    return sleepScore;
  }

  // Basic normalization function to map values between 0 and 1
  private normalize(value: number, idealValue: number): number {
    if (idealValue === 0) {
      return 0;
    }
    return Math.min(1, Math.max(0, value / idealValue));
  }



}
