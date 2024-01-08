import { Component, OnInit, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GoalsComponent } from '../goals/goals.component';
import { MatDialog } from '@angular/material/dialog';
import { Exercise } from 'src/app/interfaces/exerciseResponse.interface';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.css']
})

export class ExerciseComponent implements OnInit {
  ExerciseDurationCurrentDay: any;
  goalsCurrentDayExerciseDuration: any;
  percentageExercise: any;
  percentageTitleExercise: any;
  exerciseTypeControl = new FormControl();
  exerciseSuggestions: string[] = [];
  userId: any;
 

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
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem("userId");
    this.goalsCurrentDayExerciseDuration = localStorage.getItem("ExerciseDurationGoalsCurrentDay");
    this.ExerciseDurationCurrentDay = localStorage.getItem("ExerciseDurationCurrentDay");
    this.percentageExercise = this.calculatePercentage(Number(this.ExerciseDurationCurrentDay), Number(this.goalsCurrentDayExerciseDuration));
    this.percentageTitleExercise = this.percentageExercise.toString() + "%";

    this.exerciseTypeControl.valueChanges.subscribe((value: string) => {
      if (value && value.trim().length > 0) {
        this.getExerciseList({ exerciseType: value, exerciseDuration: null }); // Call getExerciseList
      }
    });

  }

  calculatePercentage(part: number, whole: number): number {
    if (whole === 0) {
      return 0;
    }
    const p = (part / whole) * 100;
    return Math.floor(p);
  }

  openCreateGoalsDialog() {
    const dialogRef = this.dialog.open(GoalsComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle any actions after the dialog is closed
    });
  }

  getExerciseList(formValue: any) {
    const exerciseType = formValue.exerciseType;
    const exerciseDuration = formValue.exerciseDuration;


    this.userService.getCaloriesBurned(exerciseType).subscribe(
      (res: Exercise[]) => {

        this.exerciseSuggestions = res.map((exercise: Exercise) => exercise.name);

      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }

  getExerciseBurnedCalories(formValue: any) {
    const exerciseType = formValue.exerciseType;
    
    const exerciseDuration = formValue.exerciseDuration;
    this.userService.getCaloriesBurned(exerciseType).subscribe(
      (res: Exercise[]) => {
        if (res && res.length > 0) {
          const caloriesBurned = (res[0].calories_per_hour / 60) * exerciseDuration;
          localStorage.setItem("caloriesExercise", caloriesBurned.toString());
        }

      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }

  createExerciseLog(formValue: any) {
    const exerciseType = formValue.exerciseType;
    const exerciseDuration = formValue.exerciseDuration;
    this.getExerciseBurnedCalories(formValue);
    const caloriesBurned = localStorage.getItem("caloriesExercise");
    console.log("calories burned from exercise: ", caloriesBurned)


    this.userService.createExerciseLog(this.userId, exerciseType, exerciseDuration, Number(caloriesBurned)).subscribe((res: any) => {
      this.snackBar.open('Exercise log created successfully', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snackbar-success'],
      });

    });


}

}
