import { Component, OnInit, computed, signal } from '@angular/core';
import { User } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  userInitials1?: string;
  userInitials2?: string;
  user: User = {};

  constructor(private userService: UserService) { }

  collapsed = signal(false);
  sideNavWidth = computed(() => this.collapsed() ? '65px' : '250px');
  showCheckMark: boolean = false;


  ngOnInit(): void {

    const loggedName: any = this.userService.getLoggedUsername().username;
    this.userService.getUser(loggedName).subscribe(res => {
      this.user = res;
      localStorage.setItem('userInfo', JSON.stringify(this.user));
      localStorage.setItem('userId', JSON.stringify(this.user.id));

      this.userInitials1 = this.getInitials(this.user.firstname);
      this.userInitials2 = this.getInitials(this.user.lastname);



    });
  }

  getInitials(name: string | undefined): string {
    if (!name) {
      return "";
    }

    const names = name.split(' ');
    const initials = names.map(name => name.charAt(0)).join('');
    return initials.toUpperCase();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('user');
  }

  toggleNotification(): void {
    this.showCheckMark = !this.showCheckMark;
  }


}

