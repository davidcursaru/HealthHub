import { Component, OnInit } from '@angular/core';


@Component({

  selector: 'app-calories',
  templateUrl: './calories.component.html',
  styleUrls: ['./calories.component.css'],

})
export class CaloriesComponent implements OnInit{
  calories = localStorage.getItem("caloriesFromFood");
  caloriesBurned = localStorage.getItem("caloriesBurned");
  
  ngOnInit(): void {
    // this.calories = localStorage.getItem("caloriesFromFood");
  }
}
