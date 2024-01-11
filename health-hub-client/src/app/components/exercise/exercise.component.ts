import { Component, OnInit, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GoalsComponent } from '../goals/goals.component';
import { MatDialog } from '@angular/material/dialog';
import { Exercise } from 'src/app/interfaces/exerciseResponse.interface';
import { FormControl, NonNullableFormBuilder } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.css']
})

export class ExerciseComponent implements OnInit {
  // Get the user's local timezone offset in minutes
  timezoneOffset = new Date().getTimezoneOffset();
  currentDate = new Date();
  // Adjust startDate and endDate using the timezone offset
  startDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate(), 0, 0 - this.timezoneOffset, 0);
  endDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate(), 23, 59 - this.timezoneOffset, 59);
  isoDateString1 = this.startDate.toISOString();
  isoDateString2 = this.endDate.toISOString();
  exercises: any[] = [];
  BurnedCaloriesFromExercises: any;
  ExerciseDurationCurrentDay: any;
  goalsCurrentDayExerciseDuration: any;
  percentageExercise: any;
  percentageTitleExercise: any;
  exerciseTypeControl = new FormControl();
  exerciseSuggestions: string[] = [];
  userId: any;
  exerciseFormGroup: any = FormGroup;
  exerciseCounter: any;

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
          { title: 'Exercise data ', cols: 1, rows: 3, route: '' },
          { title: 'Progress', cols: 1, rows: 3, route: '' },
          { title: 'Exercises/activities', cols: 1, rows: 8, route: '' },
          { title: 'Burned calories from exercises calculator', cols: 1, rows: 6, route: '' },
          { columns: 1 }
        ];
      }
      else if (breakpoints[Breakpoints.Medium]) {
        return [
          { title: 'Exercise data ', cols: 1, rows: 3, route: '' },
          { title: 'Progress', cols: 1, rows: 3, route: '' },
          { title: 'Exercises/activities', cols: 1, rows: 8, route: '' },
          { title: 'Burned calories from exercises calculator', cols: 1, rows: 6, route: '' },
          { columns: 2 }
        ];
      }
      else if (breakpoints[Breakpoints.Large] || breakpoints[Breakpoints.XLarge]) {
        return [
          { title: 'Exercise data ', cols: 1, rows: 3, route: '' },
          { title: 'Progress', cols: 1, rows: 3, route: '' },
          { title: 'Exercises/activities', cols: 1, rows: 8, route: '' },
          { title: 'Burned calories from exercises calculator', cols: 2, rows: 5, route: '' },
          { columns: 3 }
        ];
      }

      return [
        { title: 'Exercise data ', cols: 1, rows: 3, route: '' },
        { title: 'Progress', cols: 1, rows: 3, route: '' },
        { title: 'Exercises/activities', cols: 1, rows: 8, route: '' },
        { title: 'Burned calories from exercises calculator', cols: 1, rows: 6, route: '' },
        { columns: 1 }
      ];

    })
  );

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem("userId");
    this.BurnedCaloriesFromExercises = localStorage.getItem("BurnedCaloriesFromExercises");
    this.goalsCurrentDayExerciseDuration = localStorage.getItem("ExerciseDurationGoalsCurrentDay");
    this.ExerciseDurationCurrentDay = localStorage.getItem("ExerciseDurationCurrentDay");
    this.percentageExercise = this.calculatePercentage(Number(this.ExerciseDurationCurrentDay), Number(this.goalsCurrentDayExerciseDuration));
    this.percentageTitleExercise = this.percentageExercise.toString() + "%";

    this.exerciseFormGroup = this.formBuilder.group({
      exerciseType: ['', Validators.required],
      exerciseDuration: ['', Validators.required]
    });

    // Subscribe to value changes of the exerciseType control
    this.exerciseFormGroup.valueChanges.subscribe((value: string) => {
      if (value) {
        this.getExerciseList(this.exerciseFormGroup.value);
      }
    });

    this.getExerciseDataInterval(this.userId, this.isoDateString1, this.isoDateString2);



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

    dialogRef.afterClosed().subscribe(() => { });
  }

  getExerciseList(formValue: any) {
    const exerciseType = formValue.exerciseType;

    this.userService.getCaloriesBurned(exerciseType).subscribe(
      (res: Exercise[]) => {
        this.exerciseSuggestions = res.map((exercise: Exercise) => exercise.name);

      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }

  getExerciseDataInterval(userId: number, startDate: string, endDate: string) {

    this.userService.getExerciseDataInterval(userId, startDate, endDate).subscribe(
      (data: any[]) => {
        this.exercises = data;
        this.exerciseCounter = data.length;
      },
      (error) => {
        console.error('Error fetching exercise data:', error);
      }
    );

  }

  getExerciseBurnedCalories(exerciseForm: NgForm) {
    const formValue = this.exerciseFormGroup.value;
    const exerciseType = formValue.exerciseType;
    const exerciseDuration = formValue.exerciseDuration;

    this.userService.getCaloriesBurned(exerciseType).subscribe(
      (res: Exercise[]) => {
        if (res && res.length > 0) {
          const caloriesBurned = Math.round((res[0].calories_per_hour / 60) * exerciseDuration);
          localStorage.setItem("caloriesExercise", caloriesBurned.toString());

        }

      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }

  createExerciseLog(exerciseForm: NgForm) {
    const formValue = this.exerciseFormGroup.value;
    const exerciseType = formValue.exerciseType;
    const exerciseDuration = formValue.exerciseDuration;
    this.getExerciseBurnedCalories(exerciseForm);

    setTimeout(() => {
      const caloriesBurned = localStorage.getItem("caloriesExercise");
      this.BurnedCaloriesFromExercises = Number(this.BurnedCaloriesFromExercises) + Number(caloriesBurned);
      this.ExerciseDurationCurrentDay = Number(this.ExerciseDurationCurrentDay) + exerciseDuration;
      this.exerciseCounter += 1;
      localStorage.setItem("BurnedCaloriesFromExercises", this.BurnedCaloriesFromExercises.toString());
      localStorage.setItem("ExerciseDurationCurrentDay", this.ExerciseDurationCurrentDay.toString());
      this.percentageExercise = this.calculatePercentage(Number(this.ExerciseDurationCurrentDay), Number(this.goalsCurrentDayExerciseDuration));
      this.percentageTitleExercise = this.percentageExercise.toString() + "%";

      this.userService.createExerciseLog(this.userId, exerciseType, exerciseDuration, Number(caloriesBurned)).subscribe((res: any) => {
        this.snackBar.open('Exercise log created successfully', 'Close', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-success'],
        });

      });
    }, 1000);

  }

}
