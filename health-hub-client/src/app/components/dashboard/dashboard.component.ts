import { Component, OnInit, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user.interface';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { GoogleAPIService } from 'src/app/services/google-api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent implements OnInit {
  user: User | null = null;
  water: any;
  steps: any;
  activeMinutes: any;
  BMRcalories: any;
  StepsCountCurrentDay: any;
  BMRCaloriesCurrentDay: any;
  HeartMinutesCurrentDay: any;
  ActiveMinutesCurrentDay: any;
  goalsCurrentDayValue: any;
  goalsCurrentDaySteps: number=7500;
  goalsCurrentDayActiveMinutes: number= 100;
  goalsCurrentDayBMRcalories: number=3000;
  percentageBMRcalories: any;
  percentageHydration: any;
  percentageSteps: any;
  percentageActiveMinutes: any;
  percentageTitleBMRcalories: any;
  percentageTitleHydration: any;
  percentageTitleSteps: any;
  percentageTitleActiveMinutes: any;
  startDate: Date = new Date();
  endDate: Date = new Date();
  isoDateString1 = this.startDate.toISOString();
  isoDateString2 = this.endDate.toISOString();
  loggedUserName: any;
  loggedFirstName: any;
  loggedLastName: any;
  userId: any = localStorage.getItem('userId');
  authorizationCode: string | any;
  startTimeMillis: number = 0;
  endTimeMillis: number = 0;


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
  decodedAuthorizationCode: string | any;

  constructor(
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private googleAPIService: GoogleAPIService
  ) {}

  navigateToDestination(dynamicPath: string) {
    this.router.navigate([dynamicPath]);
  }

  ngOnInit(): void {
    // Deserialize the userInfo from localStorage and assign it to the user variable
    this.authorizationCode = this.route.snapshot.queryParams['code'];
    this.decodedAuthorizationCode = decodeURIComponent(this.authorizationCode);

    this.setTimeRangeMillis();
    console.log("start time in millis: ", this.startTimeMillis);
    console.log("end time in millis: ", this.endTimeMillis);


    if (this.decodedAuthorizationCode) {
      // Send authorization code to your ASP.NET backend for token exchange

      this.sendAuthorizationCodeToBackend(this.decodedAuthorizationCode);

    } else {
      // Handle error or redirect to an error page

    }

    this.getStepCountData();
    this.getBMRCaloriesData();
    this.getHeartMinutesData();
    this.getActiveMinutesData();

    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      this.user = JSON.parse(userInfo);
    }

    //get the currently logged userId
    this.loggedFirstName = this.user?.firstname;
    this.loggedLastName = this.user?.lastname;

    //Service for getting the Goal/ Desired Value for the hydration goal type for the current day 
    this.userService.getGoalsTotalValueForCurrentDay("hydration", this.userId).subscribe(res => {
      this.goalsCurrentDayValue = res;
      localStorage.setItem("HydrationGoalsCurrentDay", this.goalsCurrentDayValue);
    });

    //Service for getting the Water consumed by the user in the current day range
    this.userService.getWaterQuantity(this.userId, this.isoDateString1, this.isoDateString2).subscribe(
      (res) => {
        this.water = res;
        localStorage.setItem("ConsumedWaterQuantity", res.toString());
      }
    );

    //add the data in the local storage and use it to calculate the precentage for the ng circle
    this.water = localStorage.getItem("ConsumedWaterQuantity");
    this.goalsCurrentDayValue = localStorage.getItem("HydrationGoalsCurrentDay");
    if (this.water == null || this.goalsCurrentDayValue == null) {
      // window.location.reload();
      setTimeout(() => { }, 1);
    }

    this.steps= localStorage.getItem("StepsCountCurrentDay");
    this.activeMinutes = localStorage.getItem("ActiveMinutesCurrentDay");
    this.BMRcalories = localStorage.getItem("BMRCaloriesCurrentDay");

    this.percentageBMRcalories = this.calculatePercentage(Number(this.BMRcalories), Number(this.goalsCurrentDayBMRcalories));
    this.percentageTitleBMRcalories = this.percentageBMRcalories.toString() + "%";

    this.percentageHydration = this.calculatePercentage(Number(this.water), Number(this.goalsCurrentDayValue));
    this.percentageTitleHydration = this.percentageHydration.toString() + "%";
   

    this.percentageSteps = this.calculatePercentage(Number(this.steps), Number(this.goalsCurrentDaySteps));
    this.percentageTitleSteps = this.percentageSteps.toString() + "%";
    
    this.percentageActiveMinutes = this.calculatePercentage(Number(this.activeMinutes), Number(this.goalsCurrentDayActiveMinutes));
    this.percentageTitleActiveMinutes = this.percentageActiveMinutes.toString() + "%";

  }

  //Function to calculate precentage for the progress circle
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
          // Handle the step count data received from the backend
          this.StepsCountCurrentDay = data.bucket[0]?.dataset[0]?.point[0]?.value[0]?.intVal;
          localStorage.setItem("StepsCountCurrentDay", this.StepsCountCurrentDay.toString());
          console.log("Steps count today: ", this.StepsCountCurrentDay);

        },
        (error) => {
          console.error('Error fetching step count data:', error);
        }
      );
  }

  getBMRCaloriesData(): void {
    this.googleAPIService.getBMRCalories(this.userId, this.startTimeMillis, this.endTimeMillis)
      .subscribe(
        (data) => {
          // Handle the step count data received from the backend
          this.BMRCaloriesCurrentDay = data.bucket[0]?.dataset[0]?.point[0]?.value[0]?.fpVal;
          const roundedValue = Math.round(this.BMRCaloriesCurrentDay);
          localStorage.setItem("BMRCaloriesCurrentDay", roundedValue.toString());
          console.log("BMR Calories today: ", roundedValue);

        },
        (error) => {
          console.error('Error fetching step count data:', error);
        }
      );
  }

  getHeartMinutesData(): void {
    this.googleAPIService.getHeartMinutes(this.userId, this.startTimeMillis, this.endTimeMillis)
      .subscribe(
        (data) => {
          // Handle the step count data received from the backend
          this.HeartMinutesCurrentDay = data.bucket[0]?.dataset[0]?.point[0]?.value[0]?.fpVal;
          localStorage.setItem("HeartMinutesCurrentDay", this.HeartMinutesCurrentDay);
          console.log("Heart minutes today: ", this.HeartMinutesCurrentDay);

        },
        (error) => {
          console.error('Error fetching step count data:', error);
        }
      );
  }

  getActiveMinutesData(): void {
    this.googleAPIService.getActiveMinutes(this.userId, this.startTimeMillis, this.endTimeMillis)
      .subscribe(
        (data) => {
          // Handle the step count data received from the backend
          this.ActiveMinutesCurrentDay = data.bucket[0]?.dataset[0]?.point[0]?.value[0]?.intVal;
          localStorage.setItem("ActiveMinutesCurrentDay", this.ActiveMinutesCurrentDay);
          console.log("Active minutes today: ", this.ActiveMinutesCurrentDay);

        },
        (error) => {
          console.error('Error fetching step count data:', error);
        }
      );
  }







}