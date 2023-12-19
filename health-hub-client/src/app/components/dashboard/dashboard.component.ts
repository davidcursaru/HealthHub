// import { Component, OnInit, inject } from '@angular/core';
// import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
// import { map } from 'rxjs/operators';
// import { Router } from '@angular/router';
// import { UserService } from 'src/app/services/user.service';
// import { User } from 'src/app/interfaces/user.interface';


// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.css'],



// })
// export class DashboardComponent implements OnInit {
//   user: User = {};
//   water: any;
//   goalsCurrentDayValue: any;
//   percentage: any;
//   percentageTitle: any;

//   private breakpointObserver = inject(BreakpointObserver);

//   /** Based on the screen size, switch from standard to one column per row */
//   cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
//     map(({ matches }) => {
//       if (matches) {
//         return [
//           { title: 'Main card with the Hello message and a time monitoring ex: 12:00:00', cols: 1, rows: 1, route: 'layout/dashboard' },
//           { title: 'Calories tracker', cols: 1, rows: 1, route: 'layout/calories' },
//           { title: 'Hydration tracker', cols: 1, rows: 1, route: 'layout/hydration' },
//           { title: 'Exercise tracker', cols: 1, rows: 1, route: 'layout/exercise' },
//           { title: 'Report overview month/week/day', cols: 1, rows: 1, route: 'layout/reports' },
//           { title: 'Upcoming activity/ reminder', cols: 1, rows: 1, route: 'layout/scheduling' }
//         ];
//       }

//       return [
//         { cols: 3, rows: 2, route: 'layout/dashboard' },
//         { title: 'Calories tracker', cols: 1, rows: 2, route: 'layout/calories' },
//         { title: 'Hydration tracker', cols: 1, rows: 2, route: 'layout/hydration' },
//         { title: 'Exercise tracker', cols: 1, rows: 2, route: 'layout/exercise' },
//         { title: 'Report overview month/week/day', cols: 2, rows: 3, route: 'layout/reports' },
//         { title: 'Upcoming activity/ reminder', cols: 1, rows: 3, route: 'layout/scheduling' }
//       ];
//     })
//   );

//   constructor(private router: Router, private userService: UserService) { }

//   navigateToDestination(dynamicPath: string) {
//     this.router.navigate([dynamicPath]);
//   }

//   ngOnInit(): void {
//     const loggedName: any = this.userService.getLoggedUsername().username;
//     const userId: any = localStorage.getItem("userId");

//     this.water = localStorage.getItem("waterQuantity");
//     this.userService.getUser(loggedName).subscribe(res => {
//       this.user = res;
//     });

//     this.userService.getGoalsTotalValueForCurrentDay("hydration", userId).subscribe(res => {
//       this.goalsCurrentDayValue = res;
//       localStorage.setItem("GoalsCurrentDayValue", this.goalsCurrentDayValue);
//     });

//     this.goalsCurrentDayValue = localStorage.getItem("GoalsCurrentDayValue");
//     this.percentage = this.calculatePercentage(this.water, this.goalsCurrentDayValue);
//     this.percentageTitle = this.percentage.toString() + "%";
//     console.log("Percentage: ", this.percentageTitle);
//     // console.log("Percentage: ", this.goalsCurrentDayValue);
//   }

//   calculatePercentage(part: number, whole: number): number {
//     if (whole == 0) {
//       return 0
//     }
//     const p = (part / whole) * 100;
//     return Math.floor(p);
//   }
// }


import { Component, OnInit, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user.interface';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],



})
export class DashboardComponent implements OnInit {
  user: User = {};

  water: any;
  goalsCurrentDayValue: any;
  percentage: any;
  percentageTitle: any;

  startDate: Date = new Date();
  endDate: Date = new Date();

  isoDateString1 = this.startDate.toISOString();
  isoDateString2 = this.endDate.toISOString();

  loggedUserName: any;

  loggedFirstName: any;

  loggedLastName: any;

  userId: any = localStorage.getItem("userId");



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
        { title: 'Report overview month/week/day', cols: 2, rows: 3, route: 'layout/reports' },
        { title: 'Upcoming activity/ reminder', cols: 1, rows: 3, route: 'layout/scheduling' }
      ];
    })
  );

  constructor(private router: Router, private userService: UserService) { }

  navigateToDestination(dynamicPath: string) {
    this.router.navigate([dynamicPath]);
  }

  ngOnInit(): void {
    //get the currently logged username
    const loggedName: any = this.userService.getLoggedUsername().username;

    //get the currently logged userId
    this.loggedFirstName = localStorage.getItem("UserFirstName");
    this.loggedLastName = localStorage.getItem("UserLastName");

    // this.userService.getUser(loggedName).subscribe(res => {
    //   this.user = res;
    // });


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
    this.percentage = this.calculatePercentage(this.water, this.goalsCurrentDayValue);
    this.percentageTitle = this.percentage.toString() + "%";



  }

  //Function to calculate precentage for the progress circle
  calculatePercentage(part: number, whole: number): number {
    if (whole == 0) {
      return 0
    }
    const p = (part / whole) * 100;
    return Math.floor(p);
  }
}