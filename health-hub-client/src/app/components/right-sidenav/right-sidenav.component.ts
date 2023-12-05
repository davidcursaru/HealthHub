import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-right-sidenav',
  templateUrl: './right-sidenav.component.html',
  styleUrls: ['./right-sidenav.component.css']
})
export class RightSidenavComponent implements OnInit {
  user: User = {};

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    const loggedName: any = this.userService.getLoggedUsername().username;
  
    this.userService.getUser(loggedName).subscribe(res => {
      this.user = res;
      // localStorage.setItem('userInfo', JSON.stringify(this.user));
    });
  }
}
