import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.css']
})
export class GoalsComponent {
  GoalForm!: FormGroup;
  userId: any;
  goalTypes: string[] = [
    'Active minutes(min)',
    'Burned calories(kcal)',
    'Calories intake(kcal)',
    'Exercise duration(min)',
    'Hydration(ml)',
    'Steps'
  ];
  constructor(
    private dialogRef: MatDialogRef<GoalsComponent>,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem("userId");
    this.GoalForm = this.formBuilder.group({
      goalType: ['', Validators.required],
      targetValue: ['', Validators.required],
      startDate: ['', Validators.required],
      deadline: ['', Validators.required]
    });
  }

  createGoal(formValue: any) {
    const goalType = formValue.goalType;
    const startDate = formValue.startDate;
    const targetValue = formValue.targetValue;
    const deadline = formValue.deadline;

    this.userService.createGoalLog(this.userId, goalType, targetValue, startDate, deadline).subscribe((res: any) => {
      this.snackBar.open(goalType + ' was created created successfully', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snackbar-success'],
      });
      setTimeout(() => {
      }, 4000);
      window.location.reload();

    });

  }

  onGoalTypeChange(selectedGoalType: string): void {
    this.GoalForm.get('goalType')?.setValue(selectedGoalType);
  }

}
