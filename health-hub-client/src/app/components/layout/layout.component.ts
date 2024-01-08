import { Component, OnInit, computed, signal } from '@angular/core';
import { User } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})

export class LayoutComponent implements OnInit {
  isDashboardPage: boolean = false;
  userInitials1?: string;
  userInitials2?: string;
  user: User = {};
  isLoading = this.userService.isLoading$;
  userInitial: any;

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) { }

  collapsed = signal(false);
  sideNavWidth = computed(() => this.collapsed() ? '65px' : '250px');
 

  ngOnInit(): void {
    this.userService.showLoader();
    this.userInitial= localStorage.getItem("username");
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      this.user = JSON.parse(userInfo);
    }

    this.userInitials1 = this.getInitials(this.userInitial);
    this.userInitials2 = this.getInitials(this.user.lastname);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isDashboardPage = this.router.url === '/layout/dashboard';
        localStorage.setItem('isDashboardPage', JSON.stringify(this.isDashboardPage));
      }
    });

    const storedIsDashboardPage = localStorage.getItem('isDashboardPage');
    if (storedIsDashboardPage) {
      this.isDashboardPage = JSON.parse(storedIsDashboardPage);
    }
    this.userService.hideLoader();
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
    this.userService.logout();
  }
}