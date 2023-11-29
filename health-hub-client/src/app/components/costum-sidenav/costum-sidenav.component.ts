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

  menuItems = signal<MenuItem[]>([
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: '/home-page',
    },
    {
      icon: 'flag',
      label: 'Goals',
      route: '/goals',
    },
    {
      icon: 'fastfood',
      label: 'Calories tracker',
      route: '/calories',
    },
    {
      icon: 'water_drop',
      label: 'Hydration tracker',
      route: '/hydration',
    },
    {
      icon: 'fitness_center',
      label: 'Exercise tracker',
      route: '/exercise',
    },
    {
      icon: 'event',
      label: 'Scheduling and Reminders',
      route: '/scheduling',
    },
    {
      icon: 'bar_chart',
      label: 'Reports',
      route: '/reports',
    },
    {
      icon: 'settings',
      label: 'Settings',
      route: '/settings',
    }


  ]);

  profilePicSize = computed(() => this.sideNavCollapsed() ? '32' : '100');
}
