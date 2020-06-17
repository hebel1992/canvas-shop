import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../user-service';
import {UserDataModel} from '../user-data.model';
import {Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {DialogComponent} from '../../shared/dialog/dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  currentUser: UserDataModel;
  userSubscription: Subscription;
  loadingUserData = false;
  changesSaved = false;

  countiesOfEngland;
  countiesOfScotland;
  countiesOfWales;
  countiesOfNorthernIreland;

  @ViewChild('form', {static: true}) form: NgForm;
  @ViewChild('formElement', {static: true}) formElement: ElementRef;

  constructor(private userService: UserService,
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
}
