import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';
import { Reminders } from 'src/app/interfaces/reminders.interface';

@Component({
  selector: 'app-right-sidenav',
  templateUrl: './right-sidenav.component.html',
  styleUrls: ['./right-sidenav.component.css']
})
export class RightSidenavComponent implements OnInit {
  user: User = {};
  reminders: Reminders[] = [];

  constructor(private userService: UserService) { }

  
  fetchRemindersForCurrentUser(): void {
    this.userService.getCurrentDaySchedule().subscribe(
      (data: Reminders[]) => {
        this.reminders = data;
        console.log('Received reminders:', this.reminders);
      },
      (error) => {
        console.error('Error fetching reminders:', error);
      }
    );
  }

  ngOnInit(): void {
    const loggedName: any = this.userService.getLoggedUsername().username;
    this.fetchRemindersForCurrentUser();
    this.userService.getUser(loggedName).subscribe(res => {
      this.user = res;
      // localStorage.setItem('userInfo', JSON.stringify(this.user));
    });

    this.userService.getFoodCalories('apple').subscribe(res => {
      console.log(res);
    });
  }
}
