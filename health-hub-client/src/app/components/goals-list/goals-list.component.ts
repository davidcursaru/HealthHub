import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import {JsonPipe} from '@angular/common';


@Component({
  selector: 'app-goals-list',
  templateUrl: './goals-list.component.html',
  styleUrls: ['./goals-list.component.css']
})
export class GoalsListComponent implements OnInit {

  userId: any;
  goalsList: any[] = [];
  startDate: any;
  endDate: any;
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem("userId");

  }

  getGoalsDataInterval(userId: number, startDate: string, endDate: string) {

    this.userService.getGoalsDataInterval(userId, startDate, endDate).subscribe(
      (data: any[]) => {
        
        data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        Array.prototype.unshift.apply(this.goalsList, data);
      },
      (error) => {
        console.error('Error fetching goals data:', error);
      }
    );

  }


}
