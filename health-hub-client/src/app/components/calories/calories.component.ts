import { Component, OnInit, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { User } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';
import { NutrientValues } from 'src/app/interfaces/nutrients.interface';

@Component({

  selector: 'app-calories',
  templateUrl: './calories.component.html',
  styleUrls: ['./calories.component.css'],

})
export class CaloriesComponent implements OnInit {
  user: User | null = null;
  gender: any;
  weight: any;
  height: any;
  BMI: any;
  BMIClassification: any;
  Recommendation: any;
  WaterConsumptionCurrentDay: any;
  CaloriesIntakeCurrentDay: any;
  TotalBurnedCaloriesCurrentDay: any;
  foodItemExists: boolean = false;
  calories: any;
  fat: any;
  saturatedFat: any;
  protein: any;
  sodium: any;
  potassium: any;
  cholesterol: any;
  carbohydrates: any;
  fiber: any;
  sugar: any;
  foodScore: any;
  foodName: any;
  MALE_GOAL = {
    calories: 2500,
    protein: 56,
    carbohydrates: 130,
    sugar: 36,
    fiber: 38,
    fat: 69,
    saturatedFat: 20,
    cholesterol: 300,
    sodium: 2300,
    potassium: 4700,
  };

  FEMALE_GOAL = {
    calories: 2000,
    protein: 46,
    carbohydrates: 130,
    sugar: 36,
    fiber: 25,
    fat: 62,
    saturatedFat: 20,
    cholesterol: 300,
    sodium: 2300,
    potassium: 4700,
  };
  private nutrientWeights: NutrientValues = {
    calories: 1,
    protein: 2,
    carbohydrates: 1,
    sugar: 1.5,
    fiber: 2.5,
    fat: 1,
    saturatedFat: 1.2,
    cholesterol: 1.2,
    sodium: 1.5,
    potassium: 2,
  };


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
    this.gender = this.user?.gender;

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

  createNutritionLog(formValue: any) {
    const foodItems = formValue.foodItems;
    const foodGrams = formValue.foodGrams;
    const userId: any = this.user?.id;
    this.getNutritionalValues(formValue);
    if (this.foodItemExists) {
      this.userService.createNutritionLog(userId, foodItems, foodGrams).subscribe((res: any) => {

      });

    }
    else {
      console.log("Food item does not exists, check spelling or try again");
    }

  }

  getNutritionalValues(formValue: any) {
    const foodItems = formValue.foodItems;
    const foodGrams = formValue.foodGrams;

    this.userService.getFoodCalories(foodGrams.toString() + 'g ' + foodItems).subscribe(
      (res: any) => {
        if (res && res.length > 0) {
          this.foodName = res[0].name;
          this.calories = res[0].calories;
          this.fat = res[0].fat_total_g;
          this.saturatedFat = res[0].fat_saturated_g;
          this.protein = res[0].protein_g;
          this.sodium = res[0].sodium_mg;
          this.potassium = res[0].potassium_mg;
          this.cholesterol = res[0].cholesterol_mg;
          this.carbohydrates = res[0].carbohydrates_total_g;
          this.fiber = res[0].fiber_g;
          this.sugar = res[0].sugar_g;
          this.foodItemExists = true;

          const nutrientValues: NutrientValues = {
            calories: this.calories,
            protein: this.protein,
            carbohydrates: this.carbohydrates,
            sugar: this.sugar,
            fiber: this.fiber,
            fat: this.fat,
            saturatedFat: this.saturatedFat,
            cholesterol: this.cholesterol,
            sodium: this.sodium,
            potassium: this.potassium,
          };

          this.foodScore = this.calculateHealthScore(nutrientValues, this.gender);
          console.log("health score: ", this.foodScore);

        } else {
          console.log("No data or empty response received.");
          this.foodItemExists = false;
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }

  calculateHealthScore(nutrientValues: NutrientValues, gender: string): number {
    const goals = gender === 'Male' ? this.MALE_GOAL : this.FEMALE_GOAL;
    let healthScore = 0;

    const nutrientKeys = Object.keys(goals) as (keyof NutrientValues)[];

    for (let i = 0; i < nutrientKeys.length; i++) {
      const nutrient = nutrientKeys[i];
      const diff = nutrientValues[nutrient] - goals[nutrient];

      // Apply nutrient weight
      const weightedDiff = diff * this.nutrientWeights[nutrient];

      if (weightedDiff <= 0) {
        healthScore += 10; // Positive health score for meeting or exceeding goals
      } else {
        // Apply thresholds
        const threshold = goals[nutrient] * 1.2; // Example: 20% threshold increase
        const percentageExceeded = (diff / threshold) * 100;

        // Apply nutrient ratio (if needed)
        // For example, check if the ratio of sodium to potassium is within a healthy range

        healthScore -= percentageExceeded > 50 ? 50 : percentageExceeded; // Cap the decrease
      }
    }

    return Math.max(healthScore, 0); // Ensure health score is non-negative
  }
}









