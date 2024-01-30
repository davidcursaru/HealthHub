import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';



@Component({
  selector: 'app-scheduling',
  templateUrl: './scheduling.component.html',
  styleUrls: ['./scheduling.component.css']
})
export class SchedulingComponent {

  ScheduleForm!: FormGroup;
  userId: any;

  constructor(
    private dialogRef: MatDialogRef<SchedulingComponent>,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem("userId");
    this.ScheduleForm = this.formBuilder.group({
      reminderType: ['', Validators.required],
      startActivity: ['', Validators.required],
      endActivity: ['', Validators.required],
    });
  }

  createScheduleItem(formValue: any) {
    const reminderType = formValue.reminderType;
    const startActivity = formValue.startActivity;
    const endActivity = formValue.endActivity;

    this.userService.createScheduleLog(reminderType, startActivity, endActivity).subscribe((res: any) => {
      this.snackBar.open('Schedule item was created successfully', 'Close', {
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

}



