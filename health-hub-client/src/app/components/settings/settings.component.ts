import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {
  user: User = {};
  profileForm!: FormGroup;
  editMode = false;
  updatedUsername: string = '';

  constructor(private userService: UserService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router) { }

  ngOnInit(): void {
    this.displayUser();

    this.profileForm = this.formBuilder.group({
      userName: [{ value: '', disabled: this.editMode }, Validators.required],
      firstName: [{ value: '', disabled: this.editMode }, Validators.required],
      lastName: [{ value: '', disabled: this.editMode }, Validators.required],
      email: [{ value: '', disabled: this.editMode }, [Validators.required, Validators.email]],
      weight: [{ value: '', disabled: this.editMode }, Validators.required],
      height: [{ value: '', disabled: this.editMode }, Validators.required],
      gender: [{ value: '', disabled: this.editMode }, Validators.required]
    });
  }

  displayUser() {
    const username: any = this.userService.getLoggedUsername().username;

    this.userService.getUserByUsername(username).subscribe((res: User) => {
      this.user = res;
      // Update the form values with user data
      this.profileForm.patchValue({
        userName: this.user.username,
        firstName: this.user.firstname,
        lastName: this.user.lastname,
        email: this.user.email,
        weight: this.user.weight,
        height: this.user.height,
        gender: this.user.gender,
        dateOfBirth: this.user.age
      });
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      // Get the updated form values
      const updatedUser: User = {
        id: this.user.id,
        username: this.profileForm.value.userName,
        firstname: this.profileForm.value.firstName,
        lastname: this.profileForm.value.lastName,
        email: this.profileForm.value.email,
        weight: this.profileForm.value.weight,
        height: this.profileForm.value.height,
        gender: this.profileForm.value.gender
      };

      this.updatedUsername = this.profileForm.value.userName;

      this.userService.updateUser(updatedUser).subscribe(() => {
        this.userService.updateUserName(this.profileForm.value.userName); // Update the userName in AuthService
        this._snackBar.open('User updated successfully', 'Close', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      });
    }
  }

  initiateOAuthFlow(): void {
    this.authService.initiateOAuthFlow();
  }

  deleteAccount() {
    this.userService.deleteAccount().subscribe(
      () => {
        // User deleted successfully
        this.authService.logout(); // Log out the user
        this.router.navigate(['/auth']); // Navigate to the auth page
      },
      (error: HttpErrorResponse) => {
        // Handle the error appropriately
        console.error("Error deleting user:", error);
        // You can display an error message or perform any necessary actions
      }
    );
  }

  openDeleteAccountConfirmationDialog(): void {
    const dialogRef: MatDialogRef<any> = this.dialog.open(DeleteAccountConfirmationDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteAccount();
        this.router.navigate(['/auth']);
      }
    });
  }

  openChangePasswordDialog() {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle any actions after the dialog is closed
    });
  }
}

@Component({
  selector: 'deleteAccount-confirmation-dialog',
  template: `
    <!-- <h2 mat-dialog-title>Logout Confirmation</h2> -->
    <mat-dialog-content style="font-weight: bold">
      Are you sure you want to delete your account?
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">Delete</button>
    </mat-dialog-actions>
  `
})
export class DeleteAccountConfirmationDialogComponent { }