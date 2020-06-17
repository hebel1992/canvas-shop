import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../user-service';
import {UserDataModel} from '../user-data.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  currentUser: UserDataModel;
  userSubscription: Subscription;
  loadingUserData = false;

  countiesOfEngland;
  countiesOfScotland;
  countiesOfWales;
  countiesOfNorthernIreland;

  @ViewChild('formElement', {static: true}) formElement: ElementRef;

  constructor(private userService: UserService) {
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
}
