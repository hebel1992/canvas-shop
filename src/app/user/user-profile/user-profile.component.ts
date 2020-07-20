import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Counties, UserService} from '../user-service';
import {UserDataModel} from '../user-data.model';
import {Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {DialogComponent} from './canDeactivate-dialog/dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {NgForm} from '@angular/forms';
import {UserDbService} from '../user-db-service';
import {Router} from '@angular/router';
import * as firebase from 'firebase';
import {faFacebookSquare, faGoogle} from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  currentUser: UserDataModel;
  userSubscription: Subscription;
  awaitingResult = false;
  changesSaved = false;
  errorMessage: string;
  successMessage: string;
  pageContent: HTMLElement;

  faFacebook = faFacebookSquare;
  faGoogle = faGoogle;

  counties: Counties;

  @ViewChild('form', {static: true}) form: NgForm;
  @ViewChild('container', {static: true}) container: ElementRef;


  constructor(private userService: UserService,
              private userDbService: UserDbService,
              private router: Router,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.pageContent = this.container.nativeElement as HTMLElement;

    this.currentUser = this.userService.getCurrentUser();
    if (!this.currentUser) {
      this.pageContent.style.opacity = '0';
      this.awaitingResult = true;
    }

    this.userSubscription = this.userService.userDataChanged.subscribe(user => {
      this.currentUser = user;
      this.awaitingResult = false;
      this.pageContent.style.opacity = '1';
    });

    this.counties = this.userService.getCounties();
  }

  async linkAccountToProvider(provider: string) {
    this.awaitingResult = true;
    this.pageContent.style.opacity = '0';
    let loginProvider;
    if (provider === 'facebook') {
      loginProvider = new firebase.auth.FacebookAuthProvider();
    } else {
      loginProvider = new firebase.auth.GoogleAuthProvider();
    }

    try {
      await firebase.auth().currentUser.linkWithPopup(loginProvider);
      this.awaitingResult = false;
      this.pageContent.style.opacity = '1';
      this.errorMessage = null;
      window.scrollTo(0, 0);
      this.successMessage = 'Accounts successfully linked';

    } catch (err) {
      this.awaitingResult = false;
      this.pageContent.style.opacity = '1';
      this.successMessage = null;
      window.scrollTo(0, 0);
      this.errorMessage = err.message;
    }
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.currentUser) {
      return true;
    }
    if (this.form.dirty && !this.changesSaved) {
      const dialogRef = this.dialog.open(DialogComponent);
      return dialogRef.afterClosed().pipe(map(result => {
        return result;
      }));
    } else {
      return true;
    }
  }

  async onUserUpdate(form: NgForm) {
    this.successMessage = null;
    if (this.currentUser) {
      try {
        await this.userDbService.updateData(form.form.value, this.currentUser.id);
        this.changesSaved = true;
        this.userDbService.fetchUserData(this.currentUser.id);
        this.router.navigate(['/gallery']);
      } catch (err) {
        window.scrollTo(0, 0);
        this.errorMessage = err.message;
      }
    } else {
      window.scrollTo(0, 0);
      this.errorMessage = 'You are not logged in!';
    }
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
