import {Component, OnDestroy, OnInit} from '@angular/core';
import {CheckoutService} from './checkout.service';
import {BasketItemModel} from '../basket/basket-item.model';
import {BasketService} from '../basket/basket-service';
import {Subscription} from 'rxjs';
import {UserService} from '../user/user-service';
import {UserDataModel} from '../user/user-data.model';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  purchaseStarted = false;
  basket: BasketItemModel[];
  basketSubscription: Subscription;
  currentUser: UserDataModel;
  userSubscription: Subscription;
  summary;
  error: string;

  userTitle = 'mr';
  countiesOfEngland;
  countiesOfScotland;
  countiesOfWales;
  countiesOfNorthernIreland;
  faBin = faTrash;

  constructor(private checkoutService: CheckoutService,
              private basketService: BasketService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    this.basket = this.basketService.getBasket();
    if (this.basket) {
      this.summary = this.basketService.setAndGetSummary(this.basket);
    }

    this.userSubscription = this.userService.userDataChanged.subscribe(user => {
      this.currentUser = user;
    });

    this.basketSubscription = this.basketService.basketChanged.subscribe(basket => {
      this.basket = basket;
      this.summary = this.basketService.setAndGetSummary(this.basket);
    });

    this.countiesOfEngland = this.userService.getEnglandCounties();
    this.countiesOfScotland = this.userService.getScotlandCounties();
    this.countiesOfWales = this.userService.getWalesCounties();
    this.countiesOfNorthernIreland = this.userService.getNorthernIrelandCounties();
  }

  purchaseImages(form: NgForm) {
    this.error = null;
    const paymentMethod = form.control.value.paymentMethod;
    if (!paymentMethod) {
      this.error = 'Please select payment method';
      return;
    }

    const personalData = form.value.personalData;
    const shippingAddress = form.value.address;
    const joinedData = Object.assign(personalData, shippingAddress);

    this.purchaseStarted = true;

    if (paymentMethod === 'card') {
      this.checkoutService.startCheckoutSession(joinedData, this.basket, paymentMethod).subscribe(session => {
        this.checkoutService.redirectToCheckout(session);
      }, error => this.errorHandling(error));
    } else {
      this.checkoutService.startCheckoutSession(joinedData, this.basket, paymentMethod).subscribe(res => {
        const response: any = res;
        window.location.href = response.redirect_url;
      }, error => this.errorHandling(error));
    }
  }

  // testMethod(){
  //   this.checkoutService.testMethod().subscribe();
  // }

  onDelete(imageId: string) {
    this.basketService.deleteItem(imageId).catch(err => {
      this.error = err.message;
    });
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
    this.basketSubscription.unsubscribe();
  }
}
