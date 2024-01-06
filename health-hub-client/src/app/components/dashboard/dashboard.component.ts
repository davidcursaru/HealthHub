import { Component, OnInit, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user.interface';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { GoogleAPIService } from 'src/app/services/google-api.service';
import { interval} from 'rxjs';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent implements OnInit {
  user: User | null = null;

  showCaloriesBurned: boolean = true;

  WaterConsumptionCurrentDay: any;
  CaloriesIntakeCurrentDay: any;
  StepsCountCurrentDay: any;
  BMRCaloriesCurrentDay: any;
  BurnedCaloriesFromExercises: any;
  HeartMinutesCurrentDay: any;
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
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Main card', cols: 1, rows: 1, route: 'layout/dashboard' },
          { title: 'Calories tracker', cols: 1, rows: 1, route: 'layout/calories' },
          { title: 'Hydration tracker', cols: 1, rows: 1, route: 'layout/hydration' },
          { title: 'Exercise tracker', cols: 1, rows: 1, route: 'layout/exercise' },
          { title: 'Report overview month/week/day', cols: 1, rows: 1, route: 'layout/reports' },
          { title: 'Upcoming activity/ reminder', cols: 1, rows: 1, route: 'layout/scheduling' }
        ];
      }
      return [
        { cols: 3, rows: 2, route: 'layout/dashboard' },
        { title: 'Calories tracker', cols: 1, rows: 2, route: 'layout/calories' },
        { title: 'Hydration tracker', cols: 1, rows: 2, route: 'layout/hydration' },
        { title: 'Exercise tracker', cols: 1, rows: 2, route: 'layout/exercise' },
        { title: 'Report overview', cols: 2, rows: 4, route: 'layout/reports' },
        { title: 'Steps tracker', cols: 1, rows: 2, route: 'layout/scheduling' },
        { title: 'Active minutes', cols: 1, rows: 2 }
      ];
    })
  );

  constructor(
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private googleAPIService: GoogleAPIService
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

    this.userService.getGoalsTotalValueForCurrentDay("Exercise", this.userId).subscribe(res => {
      this.goalsCurrentDayExerciseDuration = res.toString();
      if (this.goalsCurrentDayExerciseDuration === undefined) {
        this.goalsCurrentDayExerciseDuration = 0;
      }
      localStorage.setItem("ExerciseDurationGoalsCurrentDay", this.goalsCurrentDayExerciseDuration);
    });

    this.userService.getGoalsTotalValueForCurrentDay("Active minutes", this.userId).subscribe(res => {
      this.goalsCurrentDayActiveMinutes = res.toString();
      if (this.goalsCurrentDayActiveMinutes === undefined) {
        this.goalsCurrentDayActiveMinutes = 0;
      }
      localStorage.setItem("ActiveMinutesGoalsCurrentDay", this.goalsCurrentDayActiveMinutes);
    });

    this.userService.getGoalsTotalValueForCurrentDay("Burned calories", this.userId).subscribe(res => {
      this.goalsCurrentDayBurnedCalories = res.toString();
      if (this.goalsCurrentDayBurnedCalories === undefined) {
        this.goalsCurrentDayBurnedCalories = 0;
      }
      localStorage.setItem("BurnedCaloriesGoalsCurrentDay", this.goalsCurrentDayBurnedCalories);
    });

    this.userService.getGoalsTotalValueForCurrentDay("Calories intake", this.userId).subscribe(res => {
      this.goalsCurrentDayCaloriesIntake = res.toString();
      if (this.goalsCurrentDayCaloriesIntake === undefined) {
        this.goalsCurrentDayCaloriesIntake = 0;
      }
      localStorage.setItem("CaloriesIntakeGoalsCurrentDay", this.goalsCurrentDayCaloriesIntake);
    });

    this.userService.getGoalsTotalValueForCurrentDay("Hydration", this.userId).subscribe(res => {
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
    localStorage.setItem("TotalBurnedCaloriesCurrentDay", (Number(this.BMRCaloriesCurrentDay) + Number(this.BurnedCaloriesFromExercises)).toString());

    interval(100).subscribe(() => {

      this.percentageHydration = this.calculatePercentage(Number(this.WaterConsumptionCurrentDay), Number(this.goalsCurrentDayHydration));
      this.percentageTitleHydration = this.percentageHydration.toString() + "%";

      this.percentageBurnedCalories = this.calculatePercentage(Number(this.BurnedCaloriesFromExercises) + Number(this.BMRCaloriesCurrentDay), Number(this.goalsCurrentDayBurnedCalories));
      this.percentageTitleBurnedcalories = this.percentageBurnedCalories.toString() + "%";

      this.percentageSteps = this.calculatePercentage(Number(this.StepsCountCurrentDay), Number(this.goalsCurrentDaySteps));
      this.percentageTitleSteps = this.percentageSteps.toString() + "%";

      this.percentageActiveMinutes = this.calculatePercentage(Number(this.ActiveMinutesCurrentDay), Number(this.goalsCurrentDayActiveMinutes));
      this.percentageTitleActiveMinutes = this.percentageActiveMinutes.toString() + "%";

      this.percentageExercise = this.calculatePercentage(Number(this.ExerciseDurationCurrentDay), Number(this.goalsCurrentDayExerciseDuration));
      this.percentageTitleExercise = this.percentageExercise.toString() + "%";

      this.percentageCaloriesIntake = this.calculatePercentage(Number(this.CaloriesIntakeCurrentDay), Number(this.goalsCurrentDayCaloriesIntake));
      this.percentageTitleCaloriesIntake = this.percentageCaloriesIntake.toString() + "%";

    })
    

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
        }
      );
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

          this.BurnedCaloriesFromExercises = data.CaloriesSum;
          if (this.BurnedCaloriesFromExercises === undefined) {
            this.BurnedCaloriesFromExercises = 0;
          }

          this.ExerciseDurationCurrentDay = data.TotalMinutes;
          if (this.ExerciseDurationCurrentDay === undefined) {
            this.ExerciseDurationCurrentDay = 0;
          }

          localStorage.setItem("BurnedCaloriesFromExercises", this.BurnedCaloriesFromExercises.toString());
          localStorage.setItem("ExerciseDurationCurrentDay", this.ExerciseDurationCurrentDay.toString());

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

}