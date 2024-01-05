import { Component, OnInit, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { User } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';

@Component({

  selector: 'app-calories',
  templateUrl: './calories.component.html',
  styleUrls: ['./calories.component.css'],

})
export class CaloriesComponent implements OnInit {
  user: User | null = null;
  weight: any;
  height: any;
  BMI: any;
  BMIClassification: any;
  Recommendation: any;
  WaterConsumptionCurrentDay: any;
  CaloriesIntakeCurrentDay: any;
  TotalBurnedCaloriesCurrentDay: any;
  foodItemExists: boolean = false;

  private breakpointObserver = inject(BreakpointObserver);
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'BMI Card', cols: 1, rows: 1, route: '' },
          { title: 'Calories tracker', cols: 1, rows: 1, route: '' },
          { title: 'Hydration tracker', cols: 1, rows: 1, route: '' },
        ];
      }
      return [
        { title: 'Body Mass Index', cols: 1, rows: 2, route: '' },
        { title: 'Calories intake', cols: 1, rows: 2, route: '' },
        { title: 'Water intake', cols: 1, rows: 3, route: '' },
        { title: 'Calories and nutritional values calculator', cols: 2, rows: 4, route: '' },
        { title: 'Search available food items', cols: 1, rows: 3, route: '' },
      ];
    })
  );

  constructor(private userService: UserService) { }

  ngOnInit(): void {

    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      this.user = JSON.parse(userInfo);
    }
    this.weight = this.user?.weight;
    this.height = this.user?.height;

    this.BMI = this.calculateBMI(Number(this.weight), Number(this.height));
    this.BMIClassification = this.getBMIClassification(this.BMI);
    this.Recommendation = this.getRecommendation(this.BMIClassification);

    this.TotalBurnedCaloriesCurrentDay = localStorage.getItem("TotalBurnedCaloriesCurrentDay");
    this.CaloriesIntakeCurrentDay = localStorage.getItem("CaloriesIntakeCurrentDay");
    this.WaterConsumptionCurrentDay = localStorage.getItem("ConsumedWaterQuantity");

  }

  isNormalWeight(BMIClassification: string): boolean {
    return BMIClassification === 'Normal weight';
  }

  calculateBMI(weight: number, height: number): number {
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return parseFloat(bmi.toFixed(1));
  }

  getBMIClassification(bmi: number): string {
    if (bmi < 18.5) {
      return 'Underweight';
    } else if (bmi >= 18.5 && bmi < 25) {
      return 'Normal weight';
    } else if (bmi >= 25 && bmi < 30) {
      return 'Overweight';
    } else {
      return 'Obese';
    }
  }

  getRecommendation(bmiClassification: string): string {
    switch (bmiClassification) {
      case 'Underweight':
        return 'Consider a daily calorie surplus plan for weight gain.';
      case 'Normal weight':
        return 'Maintain a balanced diet and regular physical activity for optimal health.';
      case 'Overweight':
        return 'Consider a slight calorie deficit in your daily life and increase physical activity for weight management.';
      case 'Obese':
        return 'Consult with a healthcare professional for personalized guidance and a weight management plan.';
      default:
        return '';
    }
  }

  getCalorieRecommendation(BMIClassification: string): string {
    switch (BMIClassification) {
      case 'Underweight':
        return 'Around 250-500 calories surplus/day for healthy weight gain.';
      case 'Normal weight':
        return 'Maintain current caloric intake to sustain a healthy weight.';
      case 'Overweight':
        return 'Around 500 calories deficit/day for gradual weight loss.';
      case 'Obese':
        return 'Around 500-1000 calories deficit/day for weight loss and improved health.';
      default:
        return '';
    }
  }

  getBMICircleClass(bmiClassification: string): string {
    switch (bmiClassification) {
      case 'Underweight':
        return 'underweight';
      case 'Normal weight':
        return 'normal-weight';
      case 'Overweight':
        return 'overweight';
      case 'Obese':
        return 'obese';
      default:
        return '';
    }
  }

  createNutritionLog(formValue: any){
    const foodItems = formValue.foodItems;
    const foodGrams = formValue.foodGrams;
    const userId : any = this.user?.id;
    this.getNutritionalValues(formValue);
    if(this.foodItemExists)
    {
        this.userService.createNutritionLog(userId, foodItems, foodGrams).subscribe((res: any) =>{
          console.log(res);
        });
        
    }
    else
    {
      console.log("Food item does not exists, check spelling or try again");
    }

  }

  getNutritionalValues(formValue: any) {
    const foodItems = formValue.foodItems;
    const foodGrams = formValue.foodGrams;

    this.userService.getFoodCalories(foodGrams.toString() + 'g ' + foodItems).subscribe(
        (res: any) => {
            if (res && res.length > 0) {
                const calories = res[0].calories;
                console.log("Calories of food item:", calories);
                this.foodItemExists = true;
                // Do something with the calories value
            } else {
                console.log("No data or empty response received.");
                this.foodItemExists = false;
                // Handle the case where there is no data or an empty response
            }
        },
        (error) => {
            console.error("Error fetching data:", error);
            // Handle error cases here
        }
    );
}

}


 


