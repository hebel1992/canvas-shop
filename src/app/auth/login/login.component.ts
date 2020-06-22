import {Component, HostListener, OnInit} from '@angular/core';
import {faFacebookSquare, faGoogle} from '@fortawesome/free-brands-svg-icons';
import {faEnvelope, faUnlock} from '@fortawesome/free-solid-svg-icons';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ResetPasswordDialogComponent} from '../reset-password/reset-password-dialog/reset-password-dialog.component';
import * as firebase from 'firebase';
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
  googleFbSignInError: string;
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

  async ngOnInit() {
    this.innerWidth = window.innerWidth;
    console.log('login comp init');
    const cred = await this.auth.getRedirectResult();
    console.log('got redirect result');
    if (cred.user) {
      console.log('creating user start');
      await this.authService.createUserProfile(cred);
      console.log('user creation finish');
      await this.router.navigate(['/gallery']);
    }
  }

  onLogin(loginForm: NgForm) {
    this.isLoading = true;
    const email = loginForm.value.emailLog;
    const password = loginForm.value.passwordLog;

    this.authService.login(email, password).then(resp => {
      this.signInError = null;
      this.isLoading = false;
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
    this.authService.loginWithGoogle(this.innerWidth).catch(err => {
      this.googleFbSignInError = err.message;
    });
  }
}
