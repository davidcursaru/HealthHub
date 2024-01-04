import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { timer } from 'rxjs/internal/observable/timer';
@Component({
  selector: 'app-hydration',
  templateUrl: './hydration.component.html',
  styleUrls: ['./hydration.component.css']
})
export class HydrationComponent implements OnInit {
  constructor(private userService: UserService) { }

  currentDate: Date = new Date();
  litersInput: number = 0;
  userId: any = localStorage.getItem('userId');

  ngOnInit() {
    timer(0, 1000).subscribe(() => {
      this.currentDate = new Date;
    })
  }

  createLog() {
    const hydrationDate = this.currentDate;
    const liters = this.litersInput;

    if (this.litersInput) {
      this.userService.createHydrationLog(this.userId, hydrationDate, liters)
        .subscribe(
          (response) => {
            console.log('Hydration log created:', response);
            const updatedWater = Number(this.water) + Number(this.litersInput);
            localStorage.setItem('waterQuantity', updatedWater.toString());
          },
          (error) => {
            console.error('Error creating hydration log:', error);
          }
        );
    }
  }

  water: any = localStorage.getItem("waterQuantity");
}
