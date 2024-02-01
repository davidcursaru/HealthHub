import { Component, OnInit, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { User } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';
import { NutrientValues } from 'src/app/interfaces/nutrients.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GoalsComponent } from '../goals/goals.component';
import { MatDialog} from '@angular/material/dialog';
import { interval } from 'rxjs';
@Component({

  selector: 'app-calories',
  templateUrl: './calories.component.html',
  styleUrls: ['./calories.component.css'],

})
export class CaloriesComponent implements OnInit {
  user: User | null = null;
  userId: any;
  gender: any;
  weight: any;
  height: any;
  BMI: any;
  BMIClassification: any;
  Recommendation: any;
  WaterConsumptionCurrentDay: any;
  CaloriesIntakeCurrentDay: any;
  BMRCaloriesCurrentDay: any;
  BurnedCaloriesFromExercises: any;
  TotalBurnedCaloriesCurrentDay: any;
  goalsCurrentDayCaloriesIntake: any;
  goalsCurrentDayBurnedCalories: any;
  percentageCaloriesIntake: any;
  percentageTitleCaloriesIntake: any;
  percentageBurnedCalories: any;
  percentageTitleBurnedCalories: any;
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
    calories: 1.2,
    protein: 1,
    carbohydrates: 1,
    sugar: 2,
    fiber: 1,
    fat: 1,
    saturatedFat: 2,
    cholesterol: 2,
    sodium: 2,
    potassium: 1,
  };

  private breakpointObserver = inject(BreakpointObserver);
  cards = this.breakpointObserver.observe([
    Breakpoints.Small,
    Breakpoints.Handset,
    Breakpoints.Medium,
    Breakpoints.Large,
    Breakpoints.XLarge
  ]).pipe(
    map(({ breakpoints }) => {
      if (breakpoints[Breakpoints.Small] || breakpoints[Breakpoints.Handset]) {
        return [
          { title: 'Body Mass Index', cols: 1, rows: 2, route: '' },
          { title: 'Calories intake', cols: 1, rows: 2, route: '' },
          { title: 'Water intake', cols: 1, rows: 3, route: '' },
          { title: 'Calories and nutritional values calculator', cols: 1, rows: 5, route: '' },
          { title: 'Food journal', cols: 1, rows: 5, route: '' },
          { title: 'Progress ', cols: 1, rows: 3, route: '' },
          { columns: 1 }
        ];
      }
      else if (breakpoints[Breakpoints.Medium]) {
        return [
          { title: 'Body Mass Index', cols: 1, rows: 2, route: '' },
          { title: 'Calories intake', cols: 1, rows: 2, route: '' },
          { title: 'Water intake', cols: 1, rows: 3, route: '' },
          { title: 'Calories and nutritional values calculator', cols: 1, rows: 6, route: '' },
          { title: 'Food journal', cols: 1, rows: 5, route: '' },
          { title: 'Progress ', cols: 1, rows: 3, route: '' },
          { columns: 2 }
        ];
      }
      else if (breakpoints[Breakpoints.Large]) {
        return [
          { title: 'Body Mass Index', cols: 1, rows: 2, route: '' },
          { title: 'Calories intake', cols: 1, rows: 2, route: '' },
          { title: 'Water intake', cols: 1, rows: 3, route: '' },
          { title: 'Calories and nutritional values calculator', cols: 1, rows: 5, route: '' },
          { title: 'Food journal', cols: 1, rows: 5, route: '' },
          { title: 'Progress ', cols: 1, rows: 3, route: '' },
          { columns: 3 }
        ];
      }
      else if ( breakpoints[Breakpoints.XLarge]) {
        return [
          { title: 'Body Mass Index', cols: 1, rows: 2, route: '' },
          { title: 'Calories intake', cols: 1, rows: 2, route: '' },
          { title: 'Water intake', cols: 1, rows: 3, route: '' },
          { title: 'Calories and nutritional values calculator', cols: 2, rows: 4, route: '' },
          { title: 'Food journal', cols: 1, rows: 5, route: '' },
          { title: 'Progress ', cols: 1, rows: 3, route: '' },
          { columns: 3 }
        ];
      }

      return [
        { title: 'Body Mass Index', cols: 1, rows: 2, route: '' },
        { title: 'Calories intake', cols: 1, rows: 2, route: '' },
        { title: 'Water intake', cols: 1, rows: 3, route: '' },
        { title: 'Calories and nutritional values calculator', cols: 1, rows: 6, route: '' },
        { title: 'Food journal', cols: 1, rows: 5, route: '' },
        { title: 'Progress ', cols: 1, rows: 3, route: '' },
        { columns: 1 }
      ];

    })
  );

 

  constructor(
    private userService: UserService, 
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    ) { }

  ngOnInit(): void {

    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      this.user = JSON.parse(userInfo);
    }
    this.weight = this.user?.weight;
    this.height = this.user?.height;
    this.gender = this.user?.gender;
    this.userId = this.user?.id;

    this.BMI = this.calculateBMI(Number(this.weight), Number(this.height));
    this.BMIClassification = this.getBMIClassification(this.BMI);
    this.Recommendation = this.getRecommendation(this.BMIClassification);

    this.userService.getGoalsTotalValueForCurrentDay("Burned calories(kcal)", this.userId).subscribe(res => {
      this.goalsCurrentDayBurnedCalories = res.toString();
      if (this.goalsCurrentDayBurnedCalories === undefined) {
        this.goalsCurrentDayBurnedCalories = 0;
      }
      localStorage.setItem("BurnedCaloriesGoalsCurrentDay", this.goalsCurrentDayBurnedCalories);
    });

    this.userService.getGoalsTotalValueForCurrentDay("Calories intake(kcal)", this.userId).subscribe(res => {
      this.goalsCurrentDayCaloriesIntake = res.toString();
      if (this.goalsCurrentDayCaloriesIntake === undefined) {
        this.goalsCurrentDayCaloriesIntake = 0;
      }
      localStorage.setItem("CaloriesIntakeGoalsCurrentDay", this.goalsCurrentDayCaloriesIntake);
    });

    this.BMRCaloriesCurrentDay = localStorage.getItem("BMRCaloriesCurrentDay");
    this.BurnedCaloriesFromExercises = localStorage.getItem("BurnedCaloriesFromExercises");
    this.goalsCurrentDayBurnedCalories = localStorage.getItem("BurnedCaloriesGoalsCurrentDay");
    this.CaloriesIntakeCurrentDay = localStorage.getItem("CaloriesIntakeCurrentDay");
    this.goalsCurrentDayCaloriesIntake = localStorage.getItem("CaloriesIntakeGoalsCurrentDay");
    this.WaterConsumptionCurrentDay = localStorage.getItem("ConsumedWaterQuantity");

    interval(100).subscribe(() => {
    this.percentageCaloriesIntake = this.calculatePercentage(Number(this.CaloriesIntakeCurrentDay), Number(this.goalsCurrentDayCaloriesIntake));
    this.percentageTitleCaloriesIntake = this.percentageCaloriesIntake.toString() + "%";

    this.percentageBurnedCalories = this.calculatePercentage(Number(this.getBurnedCaloriesSum()), Number(this.goalsCurrentDayBurnedCalories));
    this.percentageTitleBurnedCalories = this.percentageBurnedCalories.toString() + "%";
    })

  }

  isNormalWeight(BMIClassification: string): boolean {
    return BMIClassification === 'Normal weight';
  }

  calculateBMI(weight: number, height: number): number {
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return parseFloat(bmi.toFixed(1));
  }

  getBurnedCaloriesSum(): number {
    const healthHub = Number(this.BurnedCaloriesFromExercises) || 0;
    const GoogleFit = Number(this.BMRCaloriesCurrentDay) || 0;
    return GoogleFit + healthHub;
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
    setTimeout(() => {
      console.log("Food item exists: ", this.foodItemExists);
      
      const calories = localStorage.getItem("CaloriesDb");
      console.log("calories: ", calories)
      if (this.foodItemExists) {
        this.userService.createNutritionLog(userId, foodItems, foodGrams, Number(calories)).subscribe((res: any) => {
          this.snackBar.open('Nutrition log created successfully', 'Close', {
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['snackbar-success'],
          });

          this.CaloriesIntakeCurrentDay = Math.round((this.CaloriesIntakeCurrentDay ? parseFloat(this.CaloriesIntakeCurrentDay) : 0) + parseFloat(this.calories));
          this.percentageCaloriesIntake = this.calculatePercentage(Number(this.CaloriesIntakeCurrentDay), Number(this.goalsCurrentDayCaloriesIntake));
          this.percentageTitleCaloriesIntake = this.percentageCaloriesIntake.toString() + "%";

          localStorage.setItem('CaloriesIntakeCurrentDay', this.CaloriesIntakeCurrentDay.toString());


        });
      } else {
        this.snackBar.open('Nutrition log creation failed. Check the spelling of the food item and try again.', 'Close', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-success'],
        });
      }
    }, 1000);
  }

  getNutritionalValues(formValue: any) {
    const foodItems = formValue.foodItems;
    const foodGrams = formValue.foodGrams;

    this.userService.getFoodCalories(foodGrams.toString() + 'g ' + foodItems).subscribe(
      (res: any) => {
        if (res && res.length > 0) {
          this.foodName = res[0].name;
          this.calories = res[0].calories;
          localStorage.setItem("CaloriesDb", this.calories.toString());
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
          console.log("a intrat in subcribe: ", this.foodItemExists);

        } else {
          this.foodItemExists = false;
          console.log("No data or empty response received. ", this.foodItemExists);

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
      const goalThreshold = goals[nutrient] * 0.5;

      if (diff <= -goalThreshold) {
        healthScore += 10; // Positive health score for being lower than 50% of the goal
      } else {
        // Apply thresholds for certain nutrients
        const threshold = goals[nutrient];
        const percentageExceeded = Math.abs((diff / threshold) * 100);
        // Setting specific thresholds for nutrients that can be harmful in excess
        const maxThresholds: { [key in keyof NutrientValues]: number } = {
          sodium: 2300,
          cholesterol: 300,
          fat: 70,
          saturatedFat: 25,
          sugar: 40,
          calories: 2500,
          protein: 200,
          carbohydrates: 300,
          fiber: 80,
          potassium: 5000,
        };

        if (maxThresholds[nutrient] !== undefined && nutrientValues[nutrient] > maxThresholds[nutrient]) {
          healthScore -= percentageExceeded * this.nutrientWeights[nutrient];
        }
      }
    }

    return Math.round(Math.max(healthScore, 0));
  }

  getGrade(score: number): string {
    if (score >= 75) {
      return 'A';
    } else if (score >= 50) {
      return 'B';
    } else if (score >= 25) {
      return 'C';
    } else {
      return 'D';
    }
  }

  getGradeClass(score: number): string {
    if (score >= 75) {
      return 'grade-a';
    } else if (score >= 50) {
      return 'grade-b';
    } else if (score >= 25) {
      return 'grade-c';
    } else {
      return 'grade-d';
    }
  }

  calculatePercentage(part: number, whole: number): number {
    if (whole === 0) {
      return 0;
    }
    const p = (part / whole) * 100;
    return Math.floor(p);
  }

  openCreateGoalsDialog() {
    const dialogRef = this.dialog.open(GoalsComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle any actions after the dialog is closed
    });
  }

}










