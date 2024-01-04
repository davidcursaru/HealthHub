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
  firstName: any;
  lastName: any;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    // const loggedName: any = this.userService.getLoggedUsername().username;
    // localStorage.setItem('UserName', JSON.stringify(loggedName));

    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      this.user = JSON.parse(userInfo);
    }

    //get the currently logged user Info and userId and add it in the local storage to be used in other components
    // this.userService.getUser(loggedName).subscribe(res => {
    //   this.user = res;
    //   // localStorage.setItem('userInfo', JSON.stringify(this.user));
    //   this.firstName = this.user.firstname;
    //   this.lastName = this.user.lastname;
    //   localStorage.setItem('UserFirstName', this.firstName);
    //   localStorage.setItem('UserLastName', this.lastName);
    //   localStorage.setItem('userId', JSON.stringify(this.user.id));

    //   //get the initials from the username firstname and lastname for the Profile Icon
    //   this.userInitials1 = this.getInitials(this.user.firstname);
    //   this.userInitials2 = this.getInitials(this.user.lastname);

    //   //call of the fetchRemnidersForCurrentUser function that
    //   this.fetchRemindersForCurrentUser();
    // });
    this.userInitials1 = this.getInitials(this.user.firstname);
    this.userInitials2 = this.getInitials(this.user.lastname);

    this.fetchRemindersForCurrentUser();
  }

  fetchRemindersForCurrentUser(): void {
    const loggedUserId =this.user.id;

    this.userService.getCurrentDaySchedule(loggedUserId).subscribe(
      (data: Reminders[]) => {
        this.reminders = data;
        this.reminders.forEach(() => {
          this.isChecked.push(false); // Initialize all checkboxes as unchecked
        });
      },
      (error) => {
        console.error('Error fetching reminders:', error);
      }
    );
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