import { Component, Input, signal, computed } from '@angular/core';
import { RouterModule } from '@angular/router';




export type MenuItem = {

  icon: string;
  label: string;
  route: string;
}



@Component({
  selector: 'app-costum-sidenav',
  templateUrl: './costum-sidenav.component.html',
  styleUrls: ['./costum-sidenav.component.css']

})
export class CostumSidenavComponent {




  sideNavCollapsed = signal(false);
  routes = RouterModule;

  @Input() set collapsed(val: boolean) {
    this.sideNavCollapsed.set(val)
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('user');
  }

  menuItems = signal<MenuItem[]>([
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: '/layout/dashboard',
    },
    {
      icon: 'flag',
      label: 'Goals',
      route: '/layout/goals',
    },
    {
      icon: 'fastfood',
      label: 'Calories tracker',
      route: '/layout/calories',
    },
    {
      icon: 'water_drop',
      label: 'Hydration tracker',
      route: '/layout/hydration',
    },
    {
      icon: 'fitness_center',
      label: 'Exercise tracker',
      route: '/layout/exercise',
    },
    {
      icon: 'event',
      label: 'Scheduling and Reminders',
      route: '/layout/scheduling',
    },
    {
      icon: 'bar_chart',
      label: 'Reports',
      route: '/layout/reports',
    },
    {
      icon: 'settings',
      label: 'Profile Settings',
      route: '/layout/settings',
    }



  ]);

  profilePicSize = computed(() => this.sideNavCollapsed() ? '32' : '100');
}
