import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../user-service';
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
  loadingUserData = false;
  changesSaved = false;
  errorMessage: string;
  successMessage: string;

  faFacebook = faFacebookSquare;
  faGoogle = faGoogle;

  countiesOfEngland;
  countiesOfScotland;
  countiesOfWales;
  countiesOfNorthernIreland;

  @ViewChild('form', {static: true}) form: NgForm;
  @ViewChild('formElement', {static: true}) formElement: ElementRef;

  constructor(private userService: UserService,
              private userDbService: UserDbService,
              private router: Router,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {

    const htmlElement = this.formElement.nativeElement as HTMLElement;

    this.currentUser = this.userService.getCurrentUser();
    if (!this.currentUser) {
      htmlElement.style.opacity = '0';
      this.loadingUserData = true;
    }

    this.userSubscription = this.userService.userDataChanged.subscribe(user => {
      this.currentUser = user;
      this.loadingUserData = false;
      htmlElement.style.opacity = '1';
    });

    this.countiesOfEngland = this.userService.getEnglandCounties();
    this.countiesOfScotland = this.userService.getScotlandCounties();
    this.countiesOfWales = this.userService.getWalesCounties();
    this.countiesOfNorthernIreland = this.userService.getNorthernIrelandCounties();
  }

  linkAccountWithFacebook() {
    const facebookProvider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().currentUser.linkWithPopup(facebookProvider)
      .then(() => {
        this.successMessage = 'Accounts successfully linked';
      })
      .catch(error => {
        this.errorMessage = error.message;
      });
  }

  linkAccountWithGoogle() {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().currentUser.linkWithPopup(googleProvider)
      .then(() => {
        this.errorMessage = null;
        this.successMessage = 'Accounts successfully linked';
      })
      .catch(error => {
        this.successMessage = null;
        this.errorMessage = error.message;
      });
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

  onUserUpdate(form: NgForm) {
    this.successMessage = null;
    if (this.currentUser) {
      this.userDbService.updateData(form.form.value, this.currentUser.id).then(() => {
        this.changesSaved = true;
        this.userDbService.fetchUserData(this.currentUser.id).catch(err => {
          throw new Error(err);
        }).then(() => {
          this.router.navigate(['/gallery']);
        });
      }).catch(err => {
        this.errorMessage = err.message;
      });
    } else {
      this.errorMessage = 'You are not logged in!';
    }
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
