import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleAPIService {

  constructor(private http: HttpClient) { }

  getStepCount(userId: number, startTimeMillis: number, endTimeMillis: number): Observable<any> {
    const endpoint = environment.userManagement.baseUrl + 'GoogleFit/StepsCount/' + userId;
    const body = {
      StartTimeMillis: startTimeMillis,
      EndTimeMillis: endTimeMillis
    };

    return this.http.post<any>(endpoint, body);
  }

  getBMRCalories(userId: number, startTimeMillis: number, endTimeMillis: number): Observable<any> {
    const endpoint = environment.userManagement.baseUrl + 'GoogleFit/BMRCalories/' + userId;
    const body = {
      StartTimeMillis: startTimeMillis,
      EndTimeMillis: endTimeMillis
    };

    return this.http.post<any>(endpoint, body);
  }

  getHeartMinutes(userId: number, startTimeMillis: number, endTimeMillis: number): Observable<any> {
    const endpoint = environment.userManagement.baseUrl + 'GoogleFit/HeartMinutes/' + userId;
    const body = {
      StartTimeMillis: startTimeMillis,
      EndTimeMillis: endTimeMillis
    };

    return this.http.post<any>(endpoint, body);
  }

  getActiveMinutes(userId: number, startTimeMillis: number, endTimeMillis: number): Observable<any> {
    const endpoint = environment.userManagement.baseUrl + 'GoogleFit/ActiveMinutes/' + userId;
    const body = {
      StartTimeMillis: startTimeMillis,
      EndTimeMillis: endTimeMillis
    };

    return this.http.post<any>(endpoint, body);
  }
}
