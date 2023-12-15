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

  private breakpointObserver = inject(BreakpointObserver);

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Main card with the Hello message and a time monitoring ex: 12:00:00', cols: 1, rows: 1, route: 'layout/dashboard' },
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

    const loggedName: any = this.userService.getLoggedUsername().username;

    this.userService.getUser(loggedName).subscribe(res => {
      this.user = res;
    });




  }


}
