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
  currentDate: Date = new Date();
  user: User = {};
  reminders: Reminders[] = [];
  userInitials1?: string;
  userInitials2?: string;
  checked = false;
  isChecked: boolean[] = [];
  water: any = 0;
  startDate: Date = new Date("2023-12-13");
  endDate: Date = new Date("2023-12-13");

  isoDateString1 = this.startDate.toISOString();
  isoDateString2 = this.endDate.toISOString();

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    const loggedName: any = this.userService.getLoggedUsername().username;
    this.userService.getUser(loggedName).subscribe(res => {
      this.user = res;
      localStorage.setItem('userInfo', JSON.stringify(this.user));
      localStorage.setItem('userId', JSON.stringify(this.user.id));

      this.userInitials1 = this.getInitials(this.user.firstname);
      this.userInitials2 = this.getInitials(this.user.lastname);

      this.fetchRemindersForCurrentUser();
    });

    
  }

  fetchRemindersForCurrentUser(): void {
    const loggedUserId = localStorage.getItem('userId');

    this.userService.getCurrentDaySchedule(loggedUserId).subscribe(
      (data: Reminders[]) => {
        this.reminders = data;
        console.log('Received reminders:', this.reminders);
        this.reminders.forEach(() => {
          this.isChecked.push(false); // Initialize all checkboxes as unchecked
        });
      },
      (error) => {
        console.error('Error fetching reminders:', error);
      }
    );

    this.userService.getWaterQuantity(loggedUserId, this.isoDateString1, this.isoDateString2).subscribe(
      (res) => {
        this.water = res;
        localStorage.setItem("waterQuantity", res.toString());
      }
    );
    console.log('Water quantity2: ', localStorage.getItem("waterQuantity"));
  }

  getInitials(name: string | undefined): string {
    if (!name) {
      return "";
    }

    const names = name.split(' ');
    const initials = names.map(name => name.charAt(0)).join('');
    return initials.toUpperCase();
  }
}
