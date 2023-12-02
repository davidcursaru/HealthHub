import { Component, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
 
})
export class DashboardComponent {
  private breakpointObserver = inject(BreakpointObserver);

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Card 1', cols: 1, rows: 1, route:'layout/dashboard' },
          { title: 'Card 2', cols: 1, rows: 1 , route:'layout/calories'},
          { title: 'Card 3', cols: 1, rows: 1 , route:'layout/dashboard'},
          { title: 'Card 4', cols: 1, rows: 1 , route:'layout/dashboard'},
          { title: 'Card 5', cols: 1, rows: 1 , route:'layout/dashboard'},
          { title: 'Card 6', cols: 1, rows: 1 , route:'layout/dashboard'}
        ];
      }

      return [
        { title: 'Main card with the Hello message and a time monitoring ex: 12:00:00', cols: 3, rows: 2 , route:'layout/dashboard' },
        { title: 'Calories tracker', cols: 1, rows: 2 ,route:'layout/calories'},
        { title: 'Hydration tracker', cols: 1, rows: 2 ,route:'layout/hydration'},
        { title: 'Exercise tracker', cols: 1, rows: 2 ,route:'layout/exercise'},
        { title: 'Report overview month/week/day', cols: 2, rows: 3 ,route:'layout/reports'},
        { title: 'Upcoming activity/ reminder', cols: 1, rows: 3 ,route:'layout/scheduling'}
      ];
    })
  );

  constructor(private router: Router) {}

  navigateToDestination(dynamicPath: string) {
    this.router.navigate([dynamicPath]);
  }

}
