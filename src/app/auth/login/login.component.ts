import {Component, HostListener, OnInit} from '@angular/core';
import {faFacebookSquare, faGoogle} from '@fortawesome/free-brands-svg-icons';
import {faEnvelope, faUnlock} from '@fortawesome/free-solid-svg-icons';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ResetPasswordDialogComponent} from '../reset-password/reset-password-dialog/reset-password-dialog.component';
import {AngularFireAuth} from '@angular/fire/auth';

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
  googleFbSignInMessage: string;
  isLoading = false;
  innerWidth;

  constructor(private router: Router,
              private authService: AuthService,
              private dialog: MatDialog,
              private auth: AngularFireAuth) {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit() {
    this.isLoading = true;
    this.innerWidth = window.innerWidth;

    this.auth.getRedirectResult().then(cred => {
      if (cred.user) {
        return this.authService.createUserProfile(cred).then(() => {
          return this.router.navigate(['/gallery']);
        });
      } else {
        this.isLoading = false;
      }
    }).catch(err => {
      this.googleFbSignInMessage = err.message;
      this.isLoading = false;
    });
  }

  onLogin(loginForm: NgForm) {
    this.isLoading = true;
    const email = loginForm.value.emailLog;
    const password = loginForm.value.passwordLog;

    this.authService.login(email, password).then(resp => {
      this.signInError = null;
      this.router.navigate(['/gallery']);
    }).catch(err => {
      this.isLoading = false;
      this.signInError = err;
    });
  }

  resetPassword() {
    const dialogRef = this.dialog.open(ResetPasswordDialogComponent);
  }

  loginWithFacebook() {
    this.authService.loginWithFacebook(this.innerWidth).catch(err => {
      this.googleFbSignInMessage = err.message;
    });
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle(this.innerWidth).catch(err => {
      this.googleFbSignInMessage = err.message;
    });
  }
}
