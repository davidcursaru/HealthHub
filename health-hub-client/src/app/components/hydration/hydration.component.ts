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
  ngOnInit() {
    timer(0, 1000).subscribe(() => {
      this.currentDate = new Date;
    })
  }

  createLog() {
    const userId = 7;
    const hydrationDate = this.currentDate;
    const liters = this.litersInput;

    if (this.litersInput) {
      this.userService.createHydrationLog(userId, hydrationDate, liters)
        .subscribe(
          (response) => {
            console.log('Hydration log created:', response);
            // Handle success
          },
          (error) => {
            console.error('Error creating hydration log:', error);
            // Handle error
          }
        );
    }
  }

  water: any = localStorage.getItem("waterQuantity");
}
