import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private http: HttpClient) { }

  login(user: User) {
    return this.http.post('https://localhost:5000/api/account/login', user);
  }

  register(user: User) {
    return this.http.post('https://localhost:5000/api/account/register', user);
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
    const clientId = '127406299666-bclt8sqnp7kitp93tepatq1pk63p3273.apps.googleusercontent.com'; 
    const redirectUri = 'http://localhost:4200/layout/dashboard'; 
    const scope = 'https://www.googleapis.com/auth/fitness.activity.read'; 
    const authUrl = `https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

    // Redirect the user to Google's OAuth consent screen
    window.location.href = authUrl;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('user');
    //localStorage.removeItem('userInfo');
  }
}
