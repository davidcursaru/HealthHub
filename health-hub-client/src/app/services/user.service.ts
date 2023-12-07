import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { Reminders } from '../interfaces/reminders.interface';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

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

  getFoodCalories(foodInput: string) {
    const endpoint = environment.userManagement.baseUrl + 'foodapi/nutrition?query=' + foodInput;
    return this.http.get(endpoint);
  }

  getCurrentDaySchedule(): Observable<Reminders[]>{
    const endpoint= environment.userManagement.baseUrl + 'reminders/schedulling'
    return this.http.get<Reminders[]>(endpoint);
  }

}
