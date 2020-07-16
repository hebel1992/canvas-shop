import {Component, OnDestroy, OnInit} from '@angular/core';
import {CheckoutService} from './checkout.service';
import {Subscription} from 'rxjs';
import {UserService} from '../user/user-service';
import {UserDataModel} from '../user/user-data.model';
import {NgForm} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  purchaseStarted = false;
  currentUser: UserDataModel;
  userSubscription: Subscription;

  purchaseType: string;
  imageId: string;
  quantity: number;

  error: string;
  userTitle = 'mr';
  countiesOfEngland;
  countiesOfScotland;
  countiesOfWales;
  countiesOfNorthernIreland;

  constructor(private checkoutService: CheckoutService,
              private route: ActivatedRoute,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.purchaseType = this.route.snapshot.queryParamMap.get('purchaseType');
    this.imageId = this.route.snapshot.queryParamMap.get('imageId');
    this.quantity = Number(this.route.snapshot.queryParamMap.get('quantity'));

    this.currentUser = this.userService.getCurrentUser();
    this.userSubscription = this.userService.userDataChanged.subscribe(user => {
      this.currentUser = user;
    });

    this.countiesOfEngland = this.userService.getEnglandCounties();
    this.countiesOfScotland = this.userService.getScotlandCounties();
    this.countiesOfWales = this.userService.getWalesCounties();
    this.countiesOfNorthernIreland = this.userService.getNorthernIrelandCounties();
  }

  purchaseImages(form: NgForm) {
    this.error = null;
    const paymentMethod = form.control.value.paymentMethod as string;
    if (!paymentMethod) {
      this.error = 'Please select payment method';
      return;
    }

    const personalData = form.value.personalData;
    const shippingAddress = form.value.address;
    const joinedData = Object.assign(personalData, shippingAddress) as UserDataModel;

    this.purchaseStarted = true;

    if (paymentMethod === 'card') {
      this.checkoutService.startCheckoutSession(joinedData, paymentMethod, this.purchaseType, this.imageId, this.quantity)
        .subscribe(session => {
          this.checkoutService.redirectToCheckout(session);
        }, error => this.errorHandling(error));
    } else {
      this.checkoutService.startCheckoutSession(joinedData, paymentMethod, this.purchaseType, this.imageId, this.quantity)
        .subscribe(res => {
          window.location.href = res.redirect_url;
        }, error => this.errorHandling(error));
    }
  }

  errorHandling(error: any) {
    if (error.status === 504 || error.status === 404) {
      this.error = 'Server is not responding. Sorry for inconvenience.';
    } else {
      this.error = error.error.message;
    }
    this.purchaseStarted = false;
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
