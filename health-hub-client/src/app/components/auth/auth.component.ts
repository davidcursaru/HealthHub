import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar) { }

  isLoginMode: boolean = true;
  onSubmit(form: NgForm) {
    if (form.valid) {
      if (this.isLoginMode) {
        this.authService.login(form.value).subscribe({
          next: async (res: any) => {
            form.reset();
            this.authService.storeToken(res.token);
            this.authService.storeUser(res);
            localStorage.setItem('username', res.username);
            this._snackBar.open('Login Successful', 'Dismiss', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
            this.router.navigate(['layout']);
          },
          error: (err: any) => {
            this._snackBar.open('Login Failed', 'Dismiss', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
          }
        })
      }
      else {
        this.authService.register(form.value).subscribe({
          next: async (res: any) => {
            form.reset();
            this.authService.storeToken(res.token);
            this.authService.storeUser(res);
            this._snackBar.open('Registration Successful', 'Dismiss', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
            this.isLoginMode = true;
            // this.router.navigate(['auth']);
          },
          error: (err: any) => {
            this._snackBar.open('Registration Failed', 'Dismiss', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
          }
        })
      }
    }
    else {
      this._snackBar.open('Please fill in all required fields', 'Dismiss', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
}