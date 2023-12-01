import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {

  collapsed = signal(false);
  sideNavWidth = computed(() => this.collapsed() ? '65px' : '250px');
  showCheckMark: boolean = false;

  toggleNotification(): void {
    this.showCheckMark = !this.showCheckMark;
  }

}
