import { Component, Inject } from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-costum-snackbar',
  templateUrl: './costum-snackbar.component.html',
  styleUrls: ['./costum-snackbar.component.css']
})
export class CostumSnackbarComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private snackBarRef: MatSnackBarRef<CostumSnackbarComponent>,
    private router: Router
  ) {}

  notNow(): void {
    this.snackBarRef.dismiss();
  }

  signIn(): void {
    // Add your logic to route to another page
    console.log('Sign in clicked');
    // For example:
    this.router.navigate(['/layout/settings']);
    this.snackBarRef.dismiss();
  }
}
