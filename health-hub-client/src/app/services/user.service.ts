import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { Reminders } from '../interfaces/reminders.interface';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User = {};

  constructor(private http: HttpClient) { }

  getUser(userName: string) {
    const endpoint = environment.userManagement.baseUrl + 'users/username/' + userName;
    return this.http.get<User>(endpoint);
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

  getFoodCalories(foodInput: string): Observable<any> {
    const endpoint = environment.userManagement.baseUrl + 'foodapi/nutrition?query=' + foodInput;
    return this.http.get<any>(endpoint);
  }

  getCurrentDaySchedule(loggedUserId: any): Observable<Reminders[]> {
    const endpoint = environment.userManagement.baseUrl + 'reminders/schedulling/' + loggedUserId;

    return this.http.get<Reminders[]>(endpoint);
  }

  getWaterQuantity(loggedUserId: any, startDate: string, endDate: string) {
    const endpoint = environment.userManagement.baseUrl + 'hydrationLogs/count?userId=' + loggedUserId + '&startDate=' + startDate + '&endDate=' + endDate;
    return this.http.get(endpoint);
  }

  getCaloriesBurned(activity: string): Observable<any> {
    const endpoint = environment.userManagement.baseUrl + 'exercisesapi/caloriesburned?activity=' + activity;
    return this.http.get<any>(endpoint);
  }

  createHydrationLog(userId: number, hydrationDate: Date, liters: number): Observable<any> {
    const endpoint = environment.userManagement.baseUrl + 'hydrationLogs';
    const body = {
      userId: userId,
      hydrationDate: hydrationDate,
      liters: liters
    };

    return this.http.post<any>(endpoint, body);
  }

  getGoalsTotalValueForCurrentDay(goalType: string, userId: number) {
    const endpoint = environment.userManagement.baseUrl + 'goals/currentDayValue?goalType=' + goalType + "&userId=" + userId;
    return this.http.get(endpoint);

  }

}
