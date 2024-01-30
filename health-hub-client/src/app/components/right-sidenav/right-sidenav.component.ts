import { Component, Input, OnInit, computed, signal } from '@angular/core';
import { User } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';
import { Reminders } from 'src/app/interfaces/reminders.interface';
import { SchedulingComponent } from '../scheduling/scheduling.component';
import { MatDialog } from '@angular/material/dialog';


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

  // sideNavCollapsed = signal(false);
  // sideNavWidth = computed(() => this.sideNavCollapsed() ? '0px' : '280px');

  // @Input() set collapsed(val: boolean) {
  //   this.sideNavCollapsed.set(val)
  // }


  constructor(private userService: UserService, private dialog: MatDialog) { }

  ngOnInit(): void {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      this.user = JSON.parse(userInfo);
    }

    this.userInitials1 = this.getInitials(this.user.firstname);
    this.userInitials2 = this.getInitials(this.user.lastname);
    localStorage.setItem("FirstNameInitial", this.userInitials1);
    localStorage.setItem("LastNameInitial", this.userInitials2);

  
    this.fetchRemindersForCurrentUser();
  }

  fetchRemindersForCurrentUser(): void {
    const loggedUserId = this.user.id;

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

  openCreateScheduleDialog() {
    const dialogRef = this.dialog.open(SchedulingComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(() => { });
  }
}