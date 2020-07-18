import {Component, OnInit} from '@angular/core';
import {faLock} from '@fortawesome/free-solid-svg-icons';
import {NgModel} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  mode: string;
  actionCode: string;
  error: string;
  success: string;
  isLoading = false;
  actionCodeChecked = false;
  faPassword = faLock;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private auth: AngularFireAuth) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (!params) {
        this.router.navigate(['gallery']);
      }

      this.mode = params['mode'];
      this.actionCode = params['oobCode'];

      if (this.mode === 'resetPassword') {
        this.auth.verifyPasswordResetCode(this.actionCode).then(email => {
          this.actionCodeChecked = true;
        }).catch(err => {
          window.scrollTo(0, 0);
          this.error = err.message;
        });
      } else {
        window.scrollTo(0, 0);
        this.error = 'An error occurred. Please try again';
      }
    });
  }

  async onResetPasswordSubmit(password: NgModel, password2: NgModel) {
    this.isLoading = true;
    if (password.value !== password2.value) {
      window.scrollTo(0, 0);
      this.error = 'Passwords do not match';
      this.isLoading = false;
      return;
    }
    try {
      await this.auth.confirmPasswordReset(this.actionCode, password.value);
      this.error = null;
      this.success = 'Password has been changed. You can now log in.';
      this.isLoading = false;
      setTimeout(() => {
        this.router.navigate(['/gallery']);
      }, 2500);
    } catch (err) {
      window.scrollTo(0, 0);
      this.error = err.message;
      this.isLoading = false;
    }
  }
}
