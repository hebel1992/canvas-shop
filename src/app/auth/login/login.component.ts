import {Component, OnInit} from '@angular/core';
import {faFacebookSquare, faGoogle} from '@fortawesome/free-brands-svg-icons';
import {faEnvelope, faUnlock} from '@fortawesome/free-solid-svg-icons';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ResetPasswordDialogComponent} from '../reset-password/reset-password-dialog/reset-password-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  faFacebook = faFacebookSquare;
  faGoogle = faGoogle;
  faUser = faEnvelope;
  faPassword = faUnlock;

  signInError: string;
  googleFbSignInError: string;
  isLoading = false;

  constructor(private router: Router,
              private authService: AuthService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
  }

  onLogin(loginForm: NgForm) {
    this.isLoading = true;
    const email = loginForm.value.emailLog;
    const password = loginForm.value.passwordLog;

    this.authService.login(email, password).then(resp => {
      this.signInError = null;
      this.isLoading = false;
      this.router.navigate(['/']).catch(err => {
        throw new Error(err);
      });
    }).catch(err => {
      this.isLoading = false;
      this.signInError = err;
    });
  }

  resetPassword() {
    const dialogRef = this.dialog.open(ResetPasswordDialogComponent);
  }

  loginWithFacebook() {
    this.authService.loginWithFacebook().catch(err => {
      this.googleFbSignInError = err.message;
    });
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle().catch(err => {
      this.googleFbSignInError = err.message;
    });
  }
}
