import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { timer } from 'rxjs/internal/observable/timer';
import { User } from 'src/app/interfaces/user.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-hydration',
  templateUrl: './hydration.component.html',
  styleUrls: ['./hydration.component.css']
})
export class HydrationComponent implements OnInit {
  constructor(private userService: UserService, private snackBar: MatSnackBar) { }

  currentDate = new Date();

  water: any;
  userWaterIntake: number = 0;
  userId: any = localStorage.getItem('userId');
  weight: any;
  user: User = {};
  goalsCurrentDayHydration: any;
  percentageHydration: any;
  percentageTitleHydration: any;

  ngOnInit() {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      this.user = JSON.parse(userInfo);
    }
    this.weight = this.user.weight;

    const storedWater = localStorage.getItem('ConsumedWaterQuantity');
    if (storedWater) {
      this.water = Number(storedWater);
    }

    timer(0, 1000).subscribe(() => {
      this.currentDate = new Date;
    })
  }

  createLog() {
    const hydrationDate = this.currentDate;
    const liters = this.userWaterIntake;

    if (this.userWaterIntake) {
      this.userService.createHydrationLog(this.userId, liters)
        .subscribe(
          (response) => {

            const updatedWater = Number(this.water) + Number(this.userWaterIntake);
            this.updateWaterIntake();
            localStorage.setItem('ConsumedWaterQuantity', updatedWater.toString());
            this.snackBar.open('Hydration log created successfully', 'Close', {
              duration: 4000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['snackbar-success'],
            });
          },
          (error) => {
            console.error('Error creating hydration log:', error);
          }
        );
    }
  }

  updateWaterIntake() {
    this.water = Number(localStorage.getItem("ConsumedWaterQuantity")) + this.userWaterIntake;
  }

  calculateRecommendedWaterIntake(userWeight: number): number {
    return userWeight * 30;
  }


}
