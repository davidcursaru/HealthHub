import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {JsonPipe} from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-goals-list',
  templateUrl: './goals-list.component.html',
  styleUrls: ['./goals-list.component.css']
})
export class GoalsListComponent implements OnInit {
  timezoneOffset = new Date().getTimezoneOffset();
  userId: any;
  goalsList: any[] = [];

range: any;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private fb: FormBuilder) { 
      this.range = this.fb.group({
        start: [''], // Initialize start date form control
        end: ['']    // Initialize end date form control
      });
    }

  ngOnInit(): void {

    this.userId = localStorage.getItem("userId");
    

  }

  getGoalsDataInterval() {
    const currentStartDate = this.range.get('start').value;
    const currentEndDate = this.range.get('end').value;
    const startDate = new Date(currentStartDate.getFullYear(), currentStartDate.getMonth(), currentStartDate.getDate(), 0, 0 - this.timezoneOffset, 0).toISOString();
    const endDate = new Date(currentEndDate.getFullYear(), currentEndDate.getMonth(), currentEndDate.getDate(), 23, 59 - this.timezoneOffset, 59).toISOString();
    console.log("startDate:", startDate);
    console.log("endDate:", endDate);

    this.userService.getGoalsDataInterval(this.userId, startDate, endDate).subscribe(
      (data: any[]) => {
        data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.goalsList = data;
        console.log("goals list ", this.goalsList);
      },
      (error) => {
        console.error('Error fetching goals data:', error);
      }
    );

  }

  deleteGoal(logId: number) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '300px',
        data: { logId: logId },
      });
      console.log("logId goal", logId);
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.userService.deleteGoal(this.userId,logId).subscribe(
            () => {        
              this.goalsList = this.goalsList.filter(goal => goal.logId !== logId);

              } 

  
       )}
           
     });
 }
     
}

  



