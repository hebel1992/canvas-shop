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
  innerWidth: number;
  isLoading = false;


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
    this.isLoading = true;
    this.innerWidth = window.innerWidth;

    try {
      const cred = await this.auth.getRedirectResult();
      if (cred.user) {
        await this.authService.createUserProfile(cred);
        await this.router.navigate(['/gallery']);
      } else {
        this.isLoading = false;
      }
    } catch (err) {
      window.scrollTo(0, 0);
      this.signInError = err.message;
      this.isLoading = false;
    }
  }

  async onLogin(loginForm: NgForm) {
    this.isLoading = true;
    const email = loginForm.value.emailLog;
    const password = loginForm.value.passwordLog;

    try {
      await this.authService.login(email, password);
      this.signInError = null;
      await this.router.navigate(['/gallery']);
    } catch (err) {
      window.scrollTo(0, 0);
      this.isLoading = false;
      this.signInError = err.message;
    }
  }

  resetPassword() {
    const dialogRef = this.dialog.open(ResetPasswordDialogComponent);
  }

  async loginWithFacebook() {
    try {
      await this.authService.loginWithFacebook(this.innerWidth);
    } catch (err) {
      window.scrollTo(0, 0);
      this.signInError = err.message;
    }
  }

  async loginWithGoogle() {
    try {
      await this.authService.loginWithGoogle(this.innerWidth);
    } catch (err) {
      window.scrollTo(0, 0);
      this.signInError = err.message;
    }
  }
}
