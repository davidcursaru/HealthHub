import { Component, OnInit, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user.interface';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { GoogleAPIService } from 'src/app/services/google-api.service';
import { interval } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';
import { SleepRegularityService } from 'src/app/services/sleep-regularity.service';

interface TimeData {
  intervalKey: string;
  value: number;
  unit: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent implements OnInit {
  timezoneOffsetChart: any;
  currentDateChart: any;
  sevenDaysAgoDate: any;
  endDateChart: any;
  isoDateStringChart1: any;
  isoDateStringChart2: any;

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
  user: User | null = null;

  showCaloriesBurned: boolean = true;
  pointSum: any;

  WaterConsumptionCurrentDay: any;
  CaloriesIntakeCurrentDay: any;
  StepsCountCurrentDay: any;
  BMRCaloriesCurrentDay: any;
  BurnedCaloriesFromExercises: any;
  HeartMinutesCurrentDay: any;
  HeartMinutesHealthHub: any;
  ActiveMinutesCurrentDay: any;
  ExerciseDurationCurrentDay: any;

  goalsCurrentDayHydration: any;
  goalsCurrentDaySteps: any;
  goalsCurrentDayActiveMinutes: any;
  goalsCurrentDayBurnedCalories: any;
  goalsCurrentDayExerciseDuration: any;
  goalsCurrentDayCaloriesIntake: any;

  percentageBurnedCalories: any;
  percentageCaloriesIntake: any;
  percentageHydration: any;
  percentageSteps: any;
  percentageActiveMinutes: any;
  percentageExercise: any;

  percentageTitleBurnedcalories: any;
  percentageTitleCaloriesIntake: any;
  percentageTitleHydration: any;
  percentageTitleSteps: any;
  percentageTitleActiveMinutes: any;
  percentageTitleExercise: any;

  // Get the user's local timezone offset in minutes
  timezoneOffset = new Date().getTimezoneOffset();
  currentDate = new Date();
  // Adjust startDate and endDate using the timezone offset
  startDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate(), 0, 0 - this.timezoneOffset, 0);
  endDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate(), 23, 59 - this.timezoneOffset, 59);
  isoDateString1 = this.startDate.toISOString();
  isoDateString2 = this.endDate.toISOString();

  startTimeMillis: number = 0;
  endTimeMillis: number = 0;

  loggedUserName: any;
  loggedFirstName: any;
  loggedLastName: any;
  userId: any;

  authorizationCode: string | any;
  decodedAuthorizationCode: string | any;

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
          { cols: 1, rows: 3, route: 'layout/dashboard' },
          { title: 'Calories tracker', cols: 1, rows: 2, route: 'layout/calories' },
          { title: 'Hydration tracker', cols: 1, rows: 2, route: 'layout/hydration' },
          { title: 'Exercise tracker', cols: 1, rows: 2, route: 'layout/exercise' },
          { title: 'Sleep tracker', cols: 1, rows: 4, route: 'layout/reports' },
          { title: 'Steps tracker', cols: 1, rows: 2, route: 'layout/scheduling' },
          { title: 'Active minutes', cols: 1, rows: 2 },
          { columns: 1 }
        ];
      }
      else if (breakpoints[Breakpoints.Medium]) {
        return [
          { cols: 2, rows: 2, route: 'layout/dashboard' },
          { title: 'Calories tracker', cols: 1, rows: 2, route: 'layout/calories' },
          { title: 'Hydration tracker', cols: 1, rows: 2, route: 'layout/hydration' },
          { title: 'Exercise tracker', cols: 1, rows: 2, route: 'layout/exercise' },
          { title: 'Sleep tracker', cols: 2, rows: 4, route: 'layout/reports' },
          { title: 'Steps tracker', cols: 1, rows: 2, route: 'layout/scheduling' },
          { title: 'Active minutes', cols: 1, rows: 2 },
          { columns: 2 }
        ];
      }
      else if (breakpoints[Breakpoints.Large]) {
        return [
          { cols: 3, rows: 2, route: 'layout/dashboard' },
          { title: 'Calories tracker', cols: 1, rows: 2, route: 'layout/calories' },
          { title: 'Hydration tracker', cols: 1, rows: 2, route: 'layout/hydration' },
          { title: 'Exercise tracker', cols: 1, rows: 2, route: 'layout/exercise' },
          { title: 'Sleep tracker', cols: 2, rows: 4, route: 'layout/reports' },
          { title: 'Steps tracker', cols: 1, rows: 2, route: 'layout/scheduling' },
          { title: 'Active minutes', cols: 1, rows: 2 },
          { columns: 3 }
        ];
      }
      else if (breakpoints[Breakpoints.XLarge]) {
        return [
          { cols: 3, rows: 2, route: 'layout/dashboard' },
          { title: 'Calories tracker', cols: 1, rows: 2, route: 'layout/calories' },
          { title: 'Hydration tracker', cols: 1, rows: 2, route: 'layout/hydration' },
          { title: 'Exercise tracker', cols: 1, rows: 2, route: 'layout/exercise' },
          { title: 'Sleep tracker', cols: 2, rows: 4, route: 'layout/reports' },
          { title: 'Steps tracker', cols: 1, rows: 2, route: 'layout/scheduling' },
          { title: 'Active minutes', cols: 1, rows: 2 },
          { columns: 3 }
        ];
      }

      return [
        { cols: 1, rows: 3, route: 'layout/dashboard' },
        { title: 'Calories tracker', cols: 1, rows: 2, route: 'layout/calories' },
        { title: 'Hydration tracker', cols: 1, rows: 2, route: 'layout/hydration' },
        { title: 'Exercise tracker', cols: 1, rows: 2, route: 'layout/exercise' },
        { title: 'Sleep tracker', cols: 1, rows: 4, route: 'layout/reports' },
        { title: 'Steps tracker', cols: 1, rows: 2, route: 'layout/scheduling' },
        { title: 'Active minutes', cols: 1, rows: 2 },
        { columns: 1 }
      ];

    })
  );

  constructor(
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private googleAPIService: GoogleAPIService,
    private sleepRegularityService: SleepRegularityService
  ) { }

  ngOnInit(): void {

    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      this.user = JSON.parse(userInfo);
    }
    this.userId = this.user?.id;
    this.loggedFirstName = this.user?.firstname;
    this.loggedLastName = this.user?.lastname;

    this.authorizationCode = this.route.snapshot.queryParams['code'];
    this.decodedAuthorizationCode = decodeURIComponent(this.authorizationCode);

    this.setTimeRangeMillis();

    if (this.decodedAuthorizationCode) {
      // Send authorization code to the backend server for token exchange
      this.sendAuthorizationCodeToBackend(this.decodedAuthorizationCode);

    } else {
      // Handle error or redirect to an error page

    }

    this.getStepCountData();
    this.getBMRCaloriesData();
    this.getHeartMinutesData();
    this.getActiveMinutesData();
    this.getConsumedCaloriesInterval(this.userId, this.isoDateString1, this.isoDateString2);
    this.getExerciseBurnedCaloriesInterval(this.userId, this.isoDateString1, this.isoDateString2);

    //Service for getting the Water consumed by the user in the current day range
    this.userService.getWaterQuantity(this.userId, this.isoDateString1, this.isoDateString2).subscribe(
      (res) => {
        this.WaterConsumptionCurrentDay = res;
        localStorage.setItem("ConsumedWaterQuantity", res.toString());
      }
    );

    //Service for getting the Goal/ Desired Value for the goals type for the current day 
    this.userService.getGoalsTotalValueForCurrentDay("Steps", this.userId).subscribe(res => {
      this.goalsCurrentDaySteps = res.toString();
      if (this.goalsCurrentDaySteps === undefined) {
        this.goalsCurrentDaySteps = 0;
      }
      localStorage.setItem("StepsGoalsCurrentDay", this.goalsCurrentDaySteps);
    });

    this.userService.getGoalsTotalValueForCurrentDay("Exercise duration(min)", this.userId).subscribe(res => {
      this.goalsCurrentDayExerciseDuration = res.toString();
      if (this.goalsCurrentDayExerciseDuration === undefined) {
        this.goalsCurrentDayExerciseDuration = 0;
      }
      localStorage.setItem("ExerciseDurationGoalsCurrentDay", this.goalsCurrentDayExerciseDuration);
    });

    this.userService.getGoalsTotalValueForCurrentDay("Active minutes(min)", this.userId).subscribe(res => {
      this.goalsCurrentDayActiveMinutes = res.toString();
      if (this.goalsCurrentDayActiveMinutes === undefined) {
        this.goalsCurrentDayActiveMinutes = 0;
      }
      localStorage.setItem("ActiveMinutesGoalsCurrentDay", this.goalsCurrentDayActiveMinutes);
    });

    this.userService.getGoalsTotalValueForCurrentDay("Burned calories(kcal)", this.userId).subscribe(res => {
      this.goalsCurrentDayBurnedCalories = res.toString();
      if (this.goalsCurrentDayBurnedCalories === undefined) {
        this.goalsCurrentDayBurnedCalories = 0;
      }
      localStorage.setItem("BurnedCaloriesGoalsCurrentDay", this.goalsCurrentDayBurnedCalories);
    });

    this.userService.getGoalsTotalValueForCurrentDay("Calories intake(kcal)", this.userId).subscribe(res => {
      this.goalsCurrentDayCaloriesIntake = res.toString();
      if (this.goalsCurrentDayCaloriesIntake === undefined) {
        this.goalsCurrentDayCaloriesIntake = 0;
      }
      localStorage.setItem("CaloriesIntakeGoalsCurrentDay", this.goalsCurrentDayCaloriesIntake);
    });

    this.userService.getGoalsTotalValueForCurrentDay("Hydration(ml)", this.userId).subscribe(res => {
      this.goalsCurrentDayHydration = res;
      if (this.goalsCurrentDayHydration === undefined) {
        this.goalsCurrentDayHydration = 0;
      }
      localStorage.setItem("HydrationGoalsCurrentDay", this.goalsCurrentDayHydration);
    });

    //add the data in the local storage and use it to calculate the precentage for the ng circle
    this.goalsCurrentDayBurnedCalories = localStorage.getItem("BurnedCaloriesGoalsCurrentDay");
    this.goalsCurrentDayHydration = localStorage.getItem("HydrationGoalsCurrentDay");
    this.goalsCurrentDayExerciseDuration = localStorage.getItem("ExerciseDurationGoalsCurrentDay");
    this.goalsCurrentDaySteps = localStorage.getItem("StepsGoalsCurrentDay");
    this.goalsCurrentDayActiveMinutes = localStorage.getItem("ActiveMinutesGoalsCurrentDay");
    this.goalsCurrentDayCaloriesIntake = localStorage.getItem("CaloriesIntakeGoalsCurrentDay");

    this.BMRCaloriesCurrentDay = localStorage.getItem("BMRCaloriesCurrentDay");
    this.BurnedCaloriesFromExercises = localStorage.getItem("BurnedCaloriesFromExercises");
    this.WaterConsumptionCurrentDay = localStorage.getItem("ConsumedWaterQuantity");
    this.StepsCountCurrentDay = localStorage.getItem("StepsCountCurrentDay");
    this.ExerciseDurationCurrentDay = localStorage.getItem("ExerciseDurationCurrentDay");
    this.ActiveMinutesCurrentDay = localStorage.getItem("ActiveMinutesCurrentDay");
    this.CaloriesIntakeCurrentDay = localStorage.getItem("CaloriesIntakeCurrentDay");
    this.HeartMinutesCurrentDay = localStorage.getItem("HeartMinutesCurrentDay");
    this.HeartMinutesHealthHub = localStorage.getItem("HeartMinutesHealthHub");

    interval(100).subscribe(() => {

      this.percentageHydration = this.calculatePercentage(Number(this.WaterConsumptionCurrentDay), Number(this.goalsCurrentDayHydration));
      this.percentageTitleHydration = this.percentageHydration.toString() + "%";

      this.percentageBurnedCalories = this.calculatePercentage(Number(this.BurnedCaloriesFromExercises) + Number(this.BMRCaloriesCurrentDay), Number(this.goalsCurrentDayBurnedCalories));
      this.percentageTitleBurnedcalories = this.percentageBurnedCalories.toString() + "%";

      this.percentageSteps = this.calculatePercentage(Number(this.StepsCountCurrentDay), Number(this.goalsCurrentDaySteps));
      this.percentageTitleSteps = this.percentageSteps.toString() + "%";

      this.percentageActiveMinutes = this.calculatePercentage(this.getActiveMinutesSum(), Number(this.goalsCurrentDayActiveMinutes));
      this.percentageTitleActiveMinutes = this.percentageActiveMinutes.toString() + "%";

      this.percentageExercise = this.calculatePercentage(Number(this.ExerciseDurationCurrentDay), Number(this.goalsCurrentDayExerciseDuration));
      this.percentageTitleExercise = this.percentageExercise.toString() + "%";

      this.percentageCaloriesIntake = this.calculatePercentage(Number(this.CaloriesIntakeCurrentDay), Number(this.goalsCurrentDayCaloriesIntake));
      this.percentageTitleCaloriesIntake = this.percentageCaloriesIntake.toString() + "%";


    })
    this.setRequestsDateTimeRange();

    this.getSleepSessions();
    this.updateChartData();

  }

  calculatePercentage(part: number, whole: number): number {
    if (whole === 0) {
      return 0;
    }
    const p = (part / whole) * 100;
    return Math.floor(p);
  }

  sendAuthorizationCodeToBackend(authorizationCode: string): void {
    this.authService.exchangeCodeForTokens(authorizationCode)

  }

  setTimeRangeMillis(): void {
    const now = new Date();
    this.endTimeMillis = Date.now();
    now.setHours(0, 0, 0, 0);
    this.startTimeMillis = now.getTime();
  }

  getStepCountData(): void {
    this.googleAPIService.getStepCount(this.userId, this.startTimeMillis, this.endTimeMillis)
      .subscribe(
        (data) => {

          this.StepsCountCurrentDay = data.bucket[0]?.dataset[0]?.point[0]?.value[0]?.intVal;
          if (this.StepsCountCurrentDay === undefined) {
            this.StepsCountCurrentDay = 0;
          }
          localStorage.setItem("StepsCountCurrentDay", this.StepsCountCurrentDay);

        },
        (error) => {
          console.error('Error fetching step count data:', error);
          this.StepsCountCurrentDay = 0;
          localStorage.setItem("StepsCountCurrentDay", this.StepsCountCurrentDay);
        }
      );
  }

  getBMRCaloriesData(): void {
    this.googleAPIService.getBMRCalories(this.userId, this.startTimeMillis, this.endTimeMillis)
      .subscribe(
        (data) => {

          this.BMRCaloriesCurrentDay = data.bucket[0]?.dataset[0]?.point[0]?.value[0]?.fpVal;


          if (this.BMRCaloriesCurrentDay != undefined) {
            this.BMRCaloriesCurrentDay = Math.round(this.BMRCaloriesCurrentDay);
          }
          else {
            this.BMRCaloriesCurrentDay = 0;
          }

          localStorage.setItem("BMRCaloriesCurrentDay", this.BMRCaloriesCurrentDay.toString());

        },
        (error) => {
          console.error('Error fetching BMR Calories data:', error);
          this.BMRCaloriesCurrentDay = 0;
          localStorage.setItem("BMRCaloriesCurrentDay", this.BMRCaloriesCurrentDay.toString());
        }
      );
  }

  getHeartMinutesData(): void {
    this.googleAPIService.getHeartMinutes(this.userId, this.startTimeMillis, this.endTimeMillis)
      .subscribe(
        (data) => {

          this.HeartMinutesCurrentDay = data.bucket[0]?.dataset[0]?.point[0]?.value[0]?.fpVal;
          if (this.HeartMinutesCurrentDay === undefined) {
            this.HeartMinutesCurrentDay = 0;
          }
          localStorage.setItem("HeartMinutesCurrentDay", this.HeartMinutesCurrentDay);

        },
        (error) => {
          console.error('Error fetching heart minutes data:', error);
          this.HeartMinutesCurrentDay = 0;
          localStorage.setItem("HeartMinutesCurrentDay", this.HeartMinutesCurrentDay);
        }
      );
  }

  getCardioPointsSum(): number {
    const GoogleFit = Number(this.HeartMinutesCurrentDay) || 0;
    const healthHub = Number(this.HeartMinutesHealthHub) || 0;
    return GoogleFit + healthHub;
  }

  getActiveMinutesSum(): number {
    const GoogleFit = Number(this.ActiveMinutesCurrentDay) || 0;
    const healthHub = Number(this.ExerciseDurationCurrentDay) || 0;
    return GoogleFit + healthHub;
  }

  getBurnedCaloriesSum(): number {
    const healthHub = Number(this.BurnedCaloriesFromExercises) || 0;
    const GoogleFit = Number(this.BMRCaloriesCurrentDay) || 0;
    return GoogleFit + healthHub;
  }


  getActiveMinutesData(): void {
    this.googleAPIService.getActiveMinutes(this.userId, this.startTimeMillis, this.endTimeMillis)
      .subscribe(
        (data) => {

          this.ActiveMinutesCurrentDay = data.bucket[0]?.dataset[0]?.point[0]?.value[0]?.intVal;
          if (this.ActiveMinutesCurrentDay === undefined) {
            this.ActiveMinutesCurrentDay = 0;
          }
          localStorage.setItem("ActiveMinutesCurrentDay", this.ActiveMinutesCurrentDay);

        },
        (error) => {
          console.error('Error fetching active minutes data:', error);

        }
      );
  }

  getExerciseBurnedCaloriesInterval(userId: number, startDate: string, endDate: string): void {
    this.userService.getCaloriesBurnedInterval(userId, startDate, endDate)
      .subscribe(
        (data) => {

          this.BurnedCaloriesFromExercises = Math.round(data.Burned_calories);
          if (this.BurnedCaloriesFromExercises === undefined) {
            this.BurnedCaloriesFromExercises = 0;
          }

          this.ExerciseDurationCurrentDay = data.Duration;
          if (this.ExerciseDurationCurrentDay === undefined) {
            this.ExerciseDurationCurrentDay = 0;
          }

          this.HeartMinutesHealthHub = data.HeartMinutes;
          if (this.HeartMinutesHealthHub === undefined) {
            this.HeartMinutesHealthHub = 0;
          }

          localStorage.setItem("BurnedCaloriesFromExercises", this.BurnedCaloriesFromExercises.toString());
          localStorage.setItem("ExerciseDurationCurrentDay", this.ExerciseDurationCurrentDay.toString());
          localStorage.setItem("HeartMinutesHealthHub", this.HeartMinutesHealthHub.toString());

        },
        (error) => {
          console.error('Error fetching burned calories interval data:', error);

        }
      );
  }

  getConsumedCaloriesInterval(userId: number, startDate: string, endDate: string): void {
    this.userService.getCaloriesIntakeInterval(userId, startDate, endDate)
      .subscribe(
        (data) => {

          this.CaloriesIntakeCurrentDay = data;
          if (this.CaloriesIntakeCurrentDay === undefined) {
            this.CaloriesIntakeCurrentDay = 0;
          }
          else {
            this.CaloriesIntakeCurrentDay = Math.round(this.CaloriesIntakeCurrentDay);
          }

          localStorage.setItem("CaloriesIntakeCurrentDay", this.CaloriesIntakeCurrentDay.toString());

        },
        (error) => {
          console.error('Error fetching calories intake in interval data:', error);
        }
      );
  }

  toggleContent(): void {
    this.showCaloriesBurned = !this.showCaloriesBurned;
  }

  navigateToDestination(dynamicPath: string) {
    this.router.navigate([dynamicPath]);
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


  private processTimeEntries(interval: string): TimeData[] {
    // Logic to process the time entries based on the selected interval
    const timeWorkedPerInterval: TimeData[] = [];

    // Iterate through the time entries and calculate the time worked per interval
    const sleepLogsString = localStorage.getItem("sleepLogs");
    this.sleepLogs = sleepLogsString ? JSON.parse(sleepLogsString) : [];
    this.sleepLogs.forEach((entry: { startDate: string | number | Date; endDate: string | number | Date; }) => {
      const date = new Date(entry.endDate);
    
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

  getSleepSessions(): void {
    this.googleAPIService.getSession(this.userId, this.isoDateStringChart1, this.isoDateStringChart2).subscribe(
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

      });

  }

  setRequestsDateTimeRange(): void {
    this.timezoneOffsetChart = new Date().getTimezoneOffset();
    this.currentDateChart = new Date();
    // Calculate the date of 7 days ago
    this.sevenDaysAgoDate = new Date(this.currentDateChart.getFullYear(), this.currentDateChart.getMonth(), this.currentDateChart.getDate() - 7, 0, 0 - this.timezoneOffsetChart, 0);
    // startDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate(), 0, 0 - this.timezoneOffset, 0);
    this.endDateChart = new Date(this.currentDateChart.getFullYear(), this.currentDateChart.getMonth(), this.currentDateChart.getDate(), 23, 59 - this.timezoneOffsetChart, 59);
    this.isoDateStringChart1 = this.sevenDaysAgoDate.toISOString();
    this.isoDateStringChart2 = this.endDateChart.toISOString();
  }

}