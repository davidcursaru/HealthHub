import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { interval, map } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GoogleAPIService } from 'src/app/services/google-api.service';
import { SleepData } from 'src/app/interfaces/sleepPhases.interface';
import { SleepRegularityService } from 'src/app/services/sleep-regularity.service';
import { ChartData, ChartOptions } from 'chart.js';
import * as moment from 'moment';

interface TimeData {
  intervalKey: string;
  value: number;
  unit: string;
}

@Component({
  selector: 'app-sleep-tracker',
  templateUrl: './sleep-tracker.component.html',
  styleUrls: ['./sleep-tracker.component.css'],

})
export class SleepTrackerComponent {
  sleepLogs: any = [];
  optionTimeUnit: string = '';
  chartData: ChartData = {
    datasets: [],
  };
  chartLabels: string[] = [];
  chartOptions: ChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Hours Worked',
          color: 'blue'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date',
          color: 'blue'
        }
      }
    }
  };
  selectedInterval: string = 'day';

  userId: any;
  sleepForm: any;
  dateTime!: Date;
  counter: any;


  timezoneOffset: any;
  currentDate: any;
  sevenDaysAgoDate: any;
  endDate: any;
  isoDateString1: any;
  isoDateString2: any;

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
  fellAsleep: any;
  wokeUp: any;

  //for awake card
  awakeCounter: any;
  awakeHours: any;
  awakeMinutes: any;

  //for regularity card
  regularityScore: any;
  averageSleepStartTime: any;
  averageWakeUpTime: any;
  averageSleepDuration: { hours: any, minutes: any } = { hours: 0, minutes: 0 };


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
          { title: 'Asleep time', cols: 1, rows: 30, route: '' },
          { title: 'Deep sleep', cols: 1, rows: 20, route: '' },
          { title: 'Awake', cols: 1, rows: 20, route: '' },
          { title: 'Regularity', cols: 1, rows: 43, route: '' },
          { title: 'Sleep phases', cols: 1, rows: 20, route: '' },
          { columns: 1 }
        ];
      }
      else if (breakpoints[Breakpoints.Medium]) {
        return [
          { title: 'Schedule sleep hours ', cols: 1, rows: 20, route: '' },
          { title: 'Sleep score', cols: 1, rows: 20, route: '' },
          { title: 'Asleep time', cols: 1, rows: 27, route: '' },
          { title: 'Deep sleep', cols: 1, rows: 20, route: '' },
          { title: 'Awake', cols: 1, rows: 20, route: '' },
          { title: 'Regularity', cols: 1, rows: 40, route: '' },
          { title: 'Sleep phases', cols: 2, rows: 20, route: '' },
          { columns: 2 }
        ];
      }
      else if (breakpoints[Breakpoints.Large]) {
        return [
          { title: 'Schedule sleep hours ', cols: 1, rows: 20, route: '' },
          { title: 'Sleep score', cols: 1, rows: 20, route: '' },
          { title: 'Asleep time', cols: 1, rows: 30, route: '' },
          { title: 'Deep sleep', cols: 1, rows: 20, route: '' },
          { title: 'Awake', cols: 1, rows: 20, route: '' },
          { title: 'Regularity', cols: 1, rows: 36, route: '' },
          { title: 'Sleep phases', cols: 2, rows: 26, route: '' },
          { columns: 3 }
        ];
      }
      else if (breakpoints[Breakpoints.XLarge]) {
        return [
          { title: 'Schedule sleep hours ', cols: 1, rows: 20, route: '' },
          { title: 'Sleep score', cols: 1, rows: 20, route: '' },
          { title: 'Asleep time', cols: 1, rows: 30, route: '' },
          { title: 'Deep sleep', cols: 1, rows: 20, route: '' },
          { title: 'Awake', cols: 1, rows: 20, route: '' },
          { title: 'Regularity', cols: 1, rows: 36, route: '' },
          { title: 'Last 7 sleep sessions', cols: 2, rows: 35, route: '' },
          { columns: 3 }
        ];
      }

      return [
        { title: 'Schedule sleep hours ', cols: 1, rows: 20, route: '' },
        { title: 'Sleep score', cols: 1, rows: 20, route: '' },
        { title: 'Asleep time', cols: 1, rows: 30, route: '' },
        { title: 'Deep sleep', cols: 1, rows: 20, route: '' },
        { title: 'Awake', cols: 1, rows: 20, route: '' },
        { title: 'Regularity', cols: 1, rows: 33, route: '' },
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
    this.counter = 0;
    this.dateTime = new Date;
    this.setTimeRangeMillis();
    this.setRequestsDateTimeRange();
    console.log("start time isostring: ", this.isoDateString1);
    console.log("start time isostring: ", this.isoDateString2);
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

    this.getSleepSessions();
    this.updateChartData();
  }

  updateChartData(): void {
    const timeWorkedPerInterval = this.processTimeEntries(this.selectedInterval);
  
    this.chartData.datasets = [
      {
        data: timeWorkedPerInterval.map(data => data.value),
        label: 'Sleep hours',
        backgroundColor: '#076c8c',
        borderColor: '#7fa8b5',
        borderWidth: 0,
        
      },
    ];
  
    this.chartLabels = this.sortChartLabels(timeWorkedPerInterval.map(data => data.intervalKey));
  
    this.chartOptions = {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 120, // 2 hours in minutes
            callback: (value: string | number) => {
              const numericValue = typeof value === 'string' ? parseFloat(value) : value;
              const hours = Math.floor(numericValue / 60);
              return `${hours}h`;
            }
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const value = context.raw;
              const hours = Math.floor(value / 60);
              const minutes = value % 60;
              return `${hours}h ${minutes}min`;
            }
          }
        }
      }
    };
  }
  
  
  changeChartInterval(interval: string): void {
    this.selectedInterval = interval;
    this.updateChartData();
  }


  private processTimeEntries(interval: string): TimeData[] {
    // Logic to process the time entries based on the selected interval
    const timeWorkedPerInterval: TimeData[] = [];
  
    // Iterate through the time entries and calculate the time worked per interval
    const sleepLogsString = localStorage.getItem("sleepLogs");
    this.sleepLogs = sleepLogsString ? JSON.parse(sleepLogsString) : [];
    console.log("sleep logs: ", this.sleepLogs);
    this.sleepLogs.forEach((entry: { startDate: string | number | Date; endDate: string | number | Date; }) => {
      const date = new Date(entry.startDate);
      console.log("entry starTime", entry.startDate);
      console.log("date from: ", date);
  
      let intervalKey: any;
      const localeOptions: Intl.DateTimeFormatOptions = {
        // year: 'numeric',
        month: 'short',
        day: '2-digit',
        timeZone: 'Europe/Bucharest' // Replace 'Europe/Bucharest' with your desired Eastern European time zone
      };
  
      if (!isNaN(date.getTime())) {
        intervalKey = date.toLocaleDateString('en-GB', localeOptions);
      }
  
      let timeData = timeWorkedPerInterval.find(data => data.intervalKey === intervalKey);
      if (!timeData) {
        timeData = {
          intervalKey,
          value: 0,
          unit: 'Minutes'
        };
        timeWorkedPerInterval.push(timeData);
      }
  
      const startTime = new Date(entry.startDate).getTime();
      const endTime = new Date(entry.endDate).getTime();
      const durationMs = endTime - startTime;
  
      let totalMinutes: number;
  
      if (durationMs < 1000 * 60) {
        totalMinutes = durationMs / 1000 / 60;
      } else {
        totalMinutes = durationMs / (1000 * 60);
      }
  
      timeData.value += totalMinutes;
      timeData.unit = 'Minutes'; // Update the unit to 'Minutes'
    });
  
    return timeWorkedPerInterval;
  }
  

  private sortChartLabels(labels: string[]): string[] {
    return labels.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }



  // Method to handle previous button click
  previousDay(): void {
    this.counter++;
    this.updateTimeRange();
  }

  // Method to handle next button click
  nextDay(): void {

    this.counter--;
    this.updateTimeRange();

  }
  updateTimeRange(): void {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Subtract or add days based on the counter
    const displayDate = new Date(now.setDate(now.getDate() - this.counter));

    this.startTimeMillis = now.getTime();

    // Set endTimeMillis to the end of the day of the current date
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    this.endTimeMillis = endOfDay.getTime();

    // Assign displayDate to this.dateTime
    this.dateTime = displayDate;

    this.timezoneOffset = new Date().getTimezoneOffset();
    this.currentDate = displayDate;
    // Calculate the date of 7 days ago
    this.sevenDaysAgoDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() - 7, 0, 0 - this.timezoneOffset, 0);
    // startDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate(), 0, 0 - this.timezoneOffset, 0);
    this.endDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate(), 23, 59 - this.timezoneOffset, 59);
    this.isoDateString1 = this.sevenDaysAgoDate.toISOString();
    this.isoDateString2 = this.endDate.toISOString();

    this.getSleepPhases();
    this.getSleepSessions();


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

  setRequestsDateTimeRange(): void {
    this.timezoneOffset = new Date().getTimezoneOffset();
    this.currentDate = new Date();
    // Calculate the date of 7 days ago
    this.sevenDaysAgoDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() - 7, 0, 0 - this.timezoneOffset, 0);
    // startDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate(), 0, 0 - this.timezoneOffset, 0);
    this.endDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate(), 23, 59 - this.timezoneOffset, 59);
    this.isoDateString1 = this.sevenDaysAgoDate.toISOString();
    this.isoDateString2 = this.endDate.toISOString();
  }


  getSleepSessions(): void {
    this.googleAPIService.getSession(this.userId, this.isoDateString1, this.isoDateString2).subscribe(
      (data) => {
        const sleepDataRegularity = [];
        this.sleepLogs = [];

        for (const session of data.session) {
          if (session.name === 'Sleep') {
            const sleepEntry = {
              sleepStartTimeMillis: parseInt(session.startTimeMillis),
              wakeUpTimeMillis: parseInt(session.endTimeMillis),
            };

            this.sleepLogs.push({
              startDate: new Date(this.sleepRegularityService.formatTimeChart(sleepEntry.sleepStartTimeMillis)),
              endDate: new Date(this.sleepRegularityService.formatTimeChart(sleepEntry.wakeUpTimeMillis))
            })
            // console.log(" date format :", this.sleepRegularityService.formatTime(sleepEntry.sleepStartTimeMillis));

            sleepDataRegularity.push(sleepEntry);
          }
        }

       

        localStorage.setItem("sleepLogs", JSON.stringify(this.sleepLogs));

        this.updateChartData();

        if (sleepDataRegularity.length > 2) {
          // Calculate and display the regularity score
          this.regularityScore = this.sleepRegularityService.calculateSRI(sleepDataRegularity);
          // Calculate and display the average sleep start time
          this.averageSleepStartTime = this.sleepRegularityService.calculateAverageSleepStartTime(sleepDataRegularity);
          // Calculate and display the average wake-up time
          this.averageWakeUpTime = this.sleepRegularityService.calculateAverageWakeUpTime(sleepDataRegularity);

          const sleepDuration = this.sleepRegularityService.convertTimeToMinutes(this.averageWakeUpTime) - this.sleepRegularityService.convertTimeToMinutes(this.averageSleepStartTime);
          this.averageSleepDuration = { hours: Math.floor(sleepDuration / 60), minutes: sleepDuration % 60 };
        }
        else if (sleepDataRegularity.length > 1) {
          this.regularityScore = 0;
          this.averageSleepStartTime = this.sleepRegularityService.calculateAverageSleepStartTime(sleepDataRegularity);
          // Calculate and display the average wake-up time
          this.averageWakeUpTime = this.sleepRegularityService.calculateAverageWakeUpTime(sleepDataRegularity);

          const sleepDuration = this.sleepRegularityService.convertTimeToMinutes(this.averageWakeUpTime) - this.sleepRegularityService.convertTimeToMinutes(this.averageSleepStartTime);
          console.log("sleep duration minutes: ", sleepDuration);
          this.averageSleepDuration = { hours: Math.floor(sleepDuration / 60), minutes: sleepDuration % 60 }
        }
        else {
          this.regularityScore = 0;
          this.averageWakeUpTime = undefined;
          this.averageSleepStartTime = undefined;
          this.averageSleepDuration.hours = undefined;
          this.averageSleepDuration.minutes = undefined;

        }

      },
      (error) => {
        console.error('Error fetching session data:', error);
        this.regularityScore = undefined;
      }
    );
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
            this.fellAsleep = this.sleepRegularityService.formatTime(this.sleepStartTimeNanos / 1000000);
            this.wokeUp = this.sleepRegularityService.formatTime(this.sleepEndTimeNanos / 1000000);
            localStorage.setItem("SleepStartTimeNanos", this.sleepStartTimeNanos.toString());
            localStorage.setItem("SleepEndTimeNanos", this.sleepEndTimeNanos.toString());
            this.sleepHours = this.calculateSleepDuration(this.sleepStartTimeNanos, this.sleepEndTimeNanos);
            this.totalSleepMinutes = (this.sleepHours.hours * 60) + this.sleepHours.minutes;
            this.calculateSleepPhaseTime(data, 5);
            this.calculateSleepPhaseTime(data, 1);
            this.score = this.calculateSleepScore(this.totalSleepMinutes, this.deepSleepMinutes, this.awakeCounter);
            const awakeTime = this.awakeHours * 60 + this.awakeMinutes;
            this.totalSleepMinutes = (this.sleepHours.hours * 60) + this.sleepHours.minutes - awakeTime;

          } else {
            console.warn('No sleep data available in the response.');
            console.log(" a intrat in else si nu s-a updatat nimic")
            this.sleepStartTimeNanos = 0;
            this.sleepEndTimeNanos = 0;
            localStorage.setItem("SleepStartTimeNanos", this.sleepStartTimeNanos.toString());
            localStorage.setItem("SleepEndTimeNanos", this.sleepEndTimeNanos.toString());
            this.score = 0;
            this.fellAsleep = undefined;
            this.awakeCounter = undefined;
            this.awakeHours = undefined;
            this.wokeUp = undefined;
            this.deepSleepPercentage = undefined;
            this.deepSleepHours = undefined;
            this.deepSleepMinutes = undefined;
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
    if (this.regularityScore <= 60 && this.regularityScore != 0) {
      return { score: this.regularityScore.toString(), title: 'Accord Care', message: '' };
    } else if (this.regularityScore > 60 && this.score <= 79) {
      return { score: this.regularityScore.toString(), title: 'Satisfying', message: '' };
    } else if (this.regularityScore >= 80 && this.score <= 89) {
      return { score: this.regularityScore.toString(), title: 'Good', message: '' };
    }
    else if (this.regularityScore > 89) {
      return { score: this.regularityScore.toString(), title: 'Optimal', message: '' };
    }
    if (this.regularityScore == 0) {
      return { score: '0', title: 'Not enough sleep data available', message: 'Track at least 3 sleep sessions with your smartwatch.' };
    }
    return { score: '0', title: 'No sleep data available', message: 'Log in with Google account to access Google Fit data' };
  }

  updateAsleepProgressMessage(value: number): { title: string, color: string } {
    if (value < 70 && value > 0) {
      return { title: 'Accord Care', color: 'red' };
    } else if (value >= 70 && value <= 89) {
      return { title: 'Good', color: 'green' };
    } else if (value > 89) {
      return { title: 'Optimal', color: 'green' };
    }
    return { title: 'No sleep data available or the sleep schedule is not set.', color: 'black' };
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
