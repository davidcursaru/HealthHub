import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { Reminders } from '../interfaces/reminders.interface';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';
import { HydrationLogs } from '../interfaces/hydrationLogs.interface';
import { NutritionLogs } from '../interfaces/nutritionLogs.interface';
import { ExerciseLogs } from '../interfaces/exerciseLogs.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User = {};
  userNameUpdated: EventEmitter<string> = new EventEmitter();
  idLocalStorage = Number(localStorage.getItem("userId"));

  constructor(private http: HttpClient) { }

  //Other related
  private loadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loadingSubject.asObservable();
  showLoader() {
    this.loadingSubject.next(true);
  }
  hideLoader() {
    this.loadingSubject.next(false);
  }

  //User related
  updateUserName(updatedUserName: string) {
    localStorage.setItem('username', updatedUserName);
    this.userNameUpdated.emit(updatedUserName);
  }
  updateUser(user: User) {
    return this.http.put<User>(environment.userManagement.baseUrl + 'users/update', user);
  }
  getUser(userName: string) {
    const endpoint = environment.userManagement.baseUrl + 'users/username/' + userName;
    return this.http.get<User>(endpoint);
  }
  getUserByUsername(username: string): Observable<User> {
    const endpoint = environment.userManagement.baseUrl + 'users/username/' + username;
    return this.http.get<any>(endpoint);
  }
  getLoggedUsername(): User {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
    return this.user;
  }
  getLoggedUserId(): number {
    const userId: any = localStorage.getItem("userId");
    return userId;
  }
  changePassword(oldPassword: string, newPassword: string): Observable<void> {
    const idLS = localStorage.getItem("userId");
    const url = `${environment.userManagement.baseUrl}users/change-password`;
    const requestBody = {
      id: idLS,
      oldPassword: oldPassword,
      newPassword: newPassword
    };
    return this.http.put<void>(url, requestBody);
  }
  deleteAccount(): Observable<void> {
    const idLS = Number(localStorage.getItem("userId"));

    const url = `${environment.userManagement.baseUrl}users/delete/${idLS}`;

    return this.http.delete<void>(url).pipe(
      tap(() => {
        console.log("User deleted successfully");
      }),
      catchError((error: HttpErrorResponse) => {
        console.error("Error deleting user:", error);
        throw error;
      })
    );
  }

  //Schedule and reminders
  getCurrentDaySchedule(loggedUserId: any): Observable<Reminders[]> {
    const endpoint = environment.userManagement.baseUrl + 'reminders/schedulling/' + loggedUserId;

    return this.http.get<Reminders[]>(endpoint);
  }

  createScheduleLog(reminderType: string, startActivity: string, endActivity: string): Observable<any> {
    const endpoint = environment.userManagement.baseUrl + 'reminders';
    const body = {
      userId: this.idLocalStorage,
      reminderType: reminderType,
      startActivity: startActivity,
      endActivity: endActivity
    };

    return this.http.post<any>(endpoint, body);
  }

  //Food API
  getFoodCalories(foodInput: string): Observable<any> {
    const endpoint = environment.userManagement.baseUrl + 'foodapi/nutrition?query=' + foodInput;
    return this.http.get<any>(endpoint);
  }

  //Exercise API
  getCaloriesBurned(activity: string): Observable<any> {
    const endpoint = environment.userManagement.baseUrl + 'exercisesapi/caloriesburned?activity=' + activity;
    return this.http.get<any>(endpoint);
  }

  //Hydration Logs
  createHydrationLog(userId: number, liters: number): Observable<any> {
    const endpoint = environment.userManagement.baseUrl + 'hydrationLogs';
    const body = {
      userId: userId,
      liters: liters
    };

    return this.http.post<any>(endpoint, body);
  }
  getWaterQuantity(loggedUserId: any, startDate: string, endDate: string) {
    const endpoint = environment.userManagement.baseUrl + 'hydrationLogs/count?userId=' + loggedUserId + '&startDate=' + startDate + '&endDate=' + endDate;
    return this.http.get(endpoint);
  }
  getAllHydrationLogs() {
    const endpoint = environment.userManagement.baseUrl + "hydrationLogs/userId/" + this.idLocalStorage;
    return this.http.get<HydrationLogs[]>(endpoint);
  }

  //Nutrition Logs
  getAllNutritionLogs() {
    const endpoint = environment.userManagement.baseUrl + "nutritionLogs/userId/" + this.idLocalStorage;
    return this.http.get<NutritionLogs[]>(endpoint);
  }

  createNutritionLog(userId: number, foodInput: string, foodGrams: number, calories: number): Observable<any> {
    const endpoint = environment.userManagement.baseUrl + 'nutritionLogs';
    const body = {
      userId: userId,
      foodConsumed: foodInput,
      grams: foodGrams,
      calories: calories
    };

    return this.http.post<any>(endpoint, body);
  }
  getCaloriesIntakeInterval(userId: number, startDate: string, endDate: string): Observable<number> {
    const endpoint = environment.userManagement.baseUrl + 'nutritionLogs/total-calories-intake?userId=' + userId + '&startDate=' + startDate + "&endDate=" + endDate;
    return this.http.get<number>(endpoint);
  }

  //Exercise logs
  getAllExerciseLogs() {
    const endpoint = environment.userManagement.baseUrl + "exercisesLogs/userId/" + this.idLocalStorage;
    return this.http.get<ExerciseLogs[]>(endpoint);
  }

  createExerciseLog(userId: number, exerciseType: string, exerciseDuration: number, burnedCalories: number, heartMinutes: Number, startTime: string): Observable<any> {
    const endpoint = environment.userManagement.baseUrl + 'exercisesLogs';
    const body = {
      userId: userId,
      exerciseDate: startTime,
      exerciseType: exerciseType,
      exerciseDuration: exerciseDuration,
      burnedCalories: burnedCalories,
      heartMinutes: heartMinutes,

    };

    return this.http.post<any>(endpoint, body);
  }
  getCaloriesBurnedInterval(userId: number, startDate: string, endDate: string): Observable<any> {
    const endpoint = environment.userManagement.baseUrl + 'exercisesLogs/total-burned-calories?userId=' + userId + '&startDate=' + startDate + "&endDate=" + endDate;
    return this.http.get<any>(endpoint);
  }
  getExerciseDataInterval(userId: number, startDate: string, endDate: string): Observable<any> {
    const endpoint = environment.userManagement.baseUrl + 'exercisesLogs/exercise-data-interval?userId=' + userId + '&startDate=' + startDate + "&endDate=" + endDate;
    return this.http.get<any>(endpoint);
  }

  deleteExercise(logId: number): Observable<any> {
    const endpoint = environment.userManagement.baseUrl + 'exercisesLogs?logId=' + logId + '&userId=' + this.idLocalStorage;

    return this.http.delete<void>(endpoint).pipe(
      tap(() => {
        console.log("User deleted successfully");
      }),
      catchError((error: HttpErrorResponse) => {
        console.error("Error deleting user:", error);
        throw error;
      })
    );
  }


  // Goal logs
  createGoalLog(userId: number, goalType: string, targetValue: number, startDate: string, deadline: string): Observable<any> {
    const endpoint = environment.userManagement.baseUrl + 'goals';
    const body = {
      userId: userId,
      goalType: goalType,
      targetValue: targetValue,
      startGoalDate: startDate,
      deadline: deadline
    };

    return this.http.post<any>(endpoint, body);
  }
  getGoalsTotalValueForCurrentDay(goalType: string, userId: number) {
    const endpoint = environment.userManagement.baseUrl + 'goals/currentDayValue?goalType=' + goalType + "&userId=" + userId;
    return this.http.get(endpoint);
  }


  logout(): void {
    localStorage.clear();
    localStorage.removeItem('GoalsCurrentDayValue');
    localStorage.removeItem('ConsumedWaterQuantity');
    localStorage.removeItem('HydrationGoalsCurrentDay');
    localStorage.removeItem('UserName');
    localStorage.removeItem('UserLastName');
    localStorage.removeItem('UserFirstName');
    localStorage.removeItem('caloriesBurned');
    localStorage.removeItem('isDashboardPage');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('username');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userId');
    localStorage.removeItem('caloriesFromFood');
    localStorage.removeItem('waterQuantity');
    localStorage.removeItem('StepsCountCurrentDay');
    localStorage.removeItem('ActiveMinutesCurrentDay');
    localStorage.removeItem('BMRCaloriesCurrentDay');
    localStorage.removeItem('HeartMinutesCurrentDay');
    localStorage.removeItem('TotalBurnedCaloriesCurrentDay');
    localStorage.removeItem('CaloriesDb');
  }

}
