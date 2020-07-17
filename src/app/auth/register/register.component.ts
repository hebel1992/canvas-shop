import {Component, OnInit} from '@angular/core';
import {faEnvelope, faLock} from '@fortawesome/free-solid-svg-icons';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  faUser = faEnvelope;
  faPassword = faLock;

  error: string;
  success: string;
  isLoading = false;

  constructor(private authService: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  async onCreateAccountSubmit(signUpForm: NgForm) {
    this.isLoading = true;
    const email = signUpForm.value.email;
    const password = signUpForm.value.password;
    const password2 = signUpForm.value.password2;

    if (password !== password2) {
      this.error = 'Confirm password does not match.';
      this.isLoading = false;
      return;
    }

    try {
      await this.authService.register(email, password);
      this.isLoading = false;
      this.error = null;
      this.success = 'Your account has been created. Redirecting...';
      setTimeout(() => {
        this.router.navigate(['']);
      }, 2500);
    } catch (err) {
      window.scrollTo(0, 0);
      this.error = err.message;
      this.isLoading = false;
    }
    signUpForm.reset();
  }
}
