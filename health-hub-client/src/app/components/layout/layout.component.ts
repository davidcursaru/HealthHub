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

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) { }

  collapsed = signal(false);
  sideNavWidth = computed(() => this.collapsed() ? '65px' : '250px');
  showCheckMark: boolean = false;


  ngOnInit(): void {
    const loggedName: any = this.userService.getLoggedUsername().username;
    const loggedUserId = localStorage.getItem('userId');

    this.userService.getUser(loggedName).subscribe(res => {
      this.user = res;
      localStorage.setItem('userInfo', JSON.stringify(this.user));
      localStorage.setItem('userId', JSON.stringify(this.user.id));

      this.userInitials1 = this.getInitials(this.user.firstname);
      this.userInitials2 = this.getInitials(this.user.lastname);

      this.userService.getFoodCalories('juice').subscribe((res: any) => {
        const calories = res[0]['calories'];
        localStorage.setItem("caloriesFromFood", calories);
        console.log(calories);
      });

      this.userService.getCaloriesBurned('running').subscribe((res) => {
        const caloriesBurned = res[0].calories_per_hour;
        localStorage.setItem("caloriesBurned", caloriesBurned);
        console.log("Calories burned: ", caloriesBurned);
      });
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isDashboardPage = this.router.url === '/layout/dashboard';
        localStorage.setItem('isDashboardPage', JSON.stringify(this.isDashboardPage));
      }
    });

    console.log('Water quantity2: ', localStorage.getItem("waterQuantity"));

    const storedIsDashboardPage = localStorage.getItem('isDashboardPage');
    if (storedIsDashboardPage) {
      this.isDashboardPage = JSON.parse(storedIsDashboardPage);
    }

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
    localStorage.removeItem('userId');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('waterQuantity');
    localStorage.removeItem('isDashboardPage');
    localStorage.removeItem('caloriesFromFood');
    localStorage.removeItem('caloriesBurned');
  }

  toggleNotification(): void {
    this.showCheckMark = !this.showCheckMark;
  }


}

