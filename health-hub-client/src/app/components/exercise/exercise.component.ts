import { Component, OnInit, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { User } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';
import { NutrientValues } from 'src/app/interfaces/nutrients.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GoalsComponent } from '../goals/goals.component';
import { MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.css']
})
export class ExerciseComponent {

  private breakpointObserver = inject(BreakpointObserver);
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Exercise data ', cols: 1, rows: 1, route: '' },
          { title: 'Progress', cols: 1, rows: 1, route: '' },
          { title: 'Exercises/activities(HealthHub)', cols: 1, rows: 1, route: '' },
          { title: 'Burned calories from exercises calculator', cols: 1, rows: 1, route: '' },
          { title: 'Finished exercises/activities(GoogleFIT)', cols: 1, rows: 1, route: '' },
        ];
      }
      return [
        { title: 'Exercise data ', cols: 1, rows: 3, route: '' },
        { title: 'Progress', cols: 1, rows: 3, route: '' },
        { title: 'Exercises/activities(HealthHub)', cols: 1, rows: 4, route: '' },
        { title: 'Burned calories from exercises calculator', cols: 2, rows: 5, route: '' },
        { title: 'Exercises/activities(GoogleFIT)', cols: 1, rows: 4, route: '' },
        
      ];
    })
  );
 

  constructor(
    private userService: UserService, 
    private snackBar: MatSnackBar,
    private dialog: MatDialog
    ) {}
  






openCreateGoalsDialog() {
  const dialogRef = this.dialog.open(GoalsComponent, {
    width: '300px'
  });

  dialogRef.afterClosed().subscribe(() => {
    // Handle any actions after the dialog is closed
  });
}

}
