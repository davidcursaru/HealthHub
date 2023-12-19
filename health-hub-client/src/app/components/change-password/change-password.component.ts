import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  passwordForm!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<ChangePasswordComponent>,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.passwordForm.valid) {
      const oldPassword = this.passwordForm.value.oldPassword;
      const newPassword = this.passwordForm.value.newPassword;
      const confirmPassword = this.passwordForm.value.confirmPassword;

      if (newPassword !== confirmPassword) {
        this.snackBar.open('New password and confirmation do not match.', 'Close', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        return;
      }

      this.userService.changePassword(oldPassword, newPassword).subscribe(
        () => {
          if (this.passwordForm.dirty) {
            this.snackBar.open('Password changed successfully.', 'Close', {
              duration: 2000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
          }
          this.dialogRef.close();
        },
        (error) => {
          this.snackBar.open('Failed to change password.', 'Close', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        }
      );
    }
  }
}
