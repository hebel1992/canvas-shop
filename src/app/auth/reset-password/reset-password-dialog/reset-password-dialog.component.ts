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

  async onSubmit(email: NgModel) {
    try {
      await this.authService.resetPassword(email.value);
      this.error = null;
      this.success = 'A password reset link has been sent to your email address.';
    } catch (err) {
      this.error = err.message;
    }
  }
}
