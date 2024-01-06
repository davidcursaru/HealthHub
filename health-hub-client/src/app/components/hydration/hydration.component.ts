import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { timer } from 'rxjs/internal/observable/timer';
import { User } from 'src/app/interfaces/user.interface';
@Component({
  selector: 'app-hydration',
  templateUrl: './hydration.component.html',
  styleUrls: ['./hydration.component.css']
})
export class HydrationComponent implements OnInit {
  constructor(private userService: UserService) { }


  currentDate = new Date();

  water: any;
  userWaterIntake: number = 0;
  userId: any = localStorage.getItem('userId');
  weight: any;
  user: User = {};

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
            console.log('Hydration log created:', response);
            const updatedWater = Number(this.water) + Number(this.userWaterIntake);
            this.updateWaterIntake();
            localStorage.setItem('waterQuantity', updatedWater.toString());
          },
          (error) => {
            console.error('Error creating hydration log:', error);
          }
        );
    }
  }

  updateWaterIntake() {
    // Update the current water intake data displayed on the card
    this.water = Number(localStorage.getItem("ConsumedWaterQuantity")) + this.userWaterIntake;
    // You might perform other actions here (e.g., API call to  update backend)
  }

  calculateRecommendedWaterIntake(userWeight: number): number {
    // Calculate the recommended water intake based on user weight
    // Example calculation (you can adjust this formula based on your requirements)
    return userWeight * 30; // Assuming 30ml per kg of body weight
  }


}
