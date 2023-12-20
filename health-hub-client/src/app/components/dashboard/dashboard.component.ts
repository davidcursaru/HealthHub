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
  user: User | null = null;
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
  userId: any = localStorage.getItem('userId');

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
    // Deserialize the userInfo from localStorage and assign it to the user variable
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      this.user = JSON.parse(userInfo);
    }
    console.log("UserInfo", userInfo);
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
    this.percentage = this.calculatePercentage(Number(this.water), Number(this.goalsCurrentDayValue));
    this.percentageTitle = this.percentage.toString() + "%";
    console.log("percentage: ", this.percentage);
  }

  //Function to calculate precentage for the progress circle
  calculatePercentage(part: number, whole: number): number {
    if (whole === 0) {
      return 0;
    }
    const p = (part / whole) * 100;
    return Math.floor(p);
  }
}