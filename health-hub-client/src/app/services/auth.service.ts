import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private http: HttpClient) { }

  login(user: User) {
    const endpoint = environment.userManagement.baseUrl + 'account/login';
    return this.http.post(endpoint, user);
  }

  register(user: User) {
    const endpoint = environment.userManagement.baseUrl + 'account/register';
    return this.http.post(endpoint, user);
  }

  storeToken(tokenVal: string) {
    localStorage.setItem('token', tokenVal);
  }

  storeUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): User {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  initiateOAuthFlow(): void {
    // Construct the OAuth consent screen URL
    const clientId = environment.GoogleAPI.clientId;
    const scope = 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.sleep.read';

    const redirectUri = 'http://localhost:4200/layout/dashboard';
    const authUrl = `https://accounts.google.com/o/oauth2/auth?response_type=code&prompt=consent&access_type=offline&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

    // Redirect the user to Google's OAuth consent screen
    window.location.href = authUrl;
  }

  exchangeCodeForTokens(authorizationCode: string): void {
    const userId = localStorage.getItem('userId');
    const body = JSON.stringify(authorizationCode);
    const endpoint = environment.userManagement.baseUrl + 'GoogleTokenExchange/google/tokenexchange/' + userId;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });


    this.http.post<any>(endpoint, body, { headers }).subscribe(
      response => {
        console.log('ExchangeCodeForTokens Response:', response);
      },
      error => {
        console.error('Error:', error);

      }
    );

  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('user');
    //localStorage.removeItem('userInfo');
  }
}
