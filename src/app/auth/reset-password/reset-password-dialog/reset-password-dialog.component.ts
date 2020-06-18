import {Component, OnInit} from '@angular/core';
import {NgModel} from '@angular/forms';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'app-reset-password-dialog',
  templateUrl: './reset-password-dialog.component.html',
  styleUrls: ['./reset-password-dialog.component.css']
})
export class ResetPasswordDialogComponent implements OnInit {
  success: string;
  error: string;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
  }

  onSubmit(email: NgModel) {
    this.authService.resetPassword(email.value)
      .then(() => {
          this.error = null;
          this.success = 'A password reset link has been sent to your email address';
        },
        (rejectionReason) => this.error = rejectionReason.message
      ).catch(err => this.error = 'An error occurred while attempting to reset your password');
  }
}
