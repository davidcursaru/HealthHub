import { Component } from '@angular/core';

@Component({
  selector: 'app-hydration',
  templateUrl: './hydration.component.html',
  styleUrls: ['./hydration.component.css']
})
export class HydrationComponent {
  water: any = localStorage.getItem("waterQuantity");

}
