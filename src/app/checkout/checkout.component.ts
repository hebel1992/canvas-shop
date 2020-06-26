import {Component, OnInit} from '@angular/core';
import {StripeCheckoutService} from './stripe-checkout.service';
import {BasketItemModel} from '../basket/basket-item.model';
import {BasketService} from '../basket/basket-service';
import {Subscription} from 'rxjs';
import {UserService} from '../user/user-service';
import {UserDataModel} from '../user/user-data.model';
import {faTrash} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  purchaseStarted = false;
  basket: BasketItemModel[];
  basketSubscription: Subscription;
  currentUser: UserDataModel;
  userSubscription;
  summary;
  error: string;

  faBin = faTrash;

  countiesOfEngland;
  countiesOfScotland;
  countiesOfWales;
  countiesOfNorthernIreland;

  constructor(private stripeCheckoutService: StripeCheckoutService,
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

  purchaseImages() {
    this.purchaseStarted = true;
    this.stripeCheckoutService.startCheckoutSession(this.basket).subscribe(session => {
      console.log('Stripe checkout session has been initialized...');
      this.stripeCheckoutService.redirectToCheckout(session);
    }, error => {
      console.log(error);
      this.purchaseStarted = false;
    });
  }

  onDelete(imageId: string) {
    this.basketService.deleteItem(imageId).catch(err => {
      this.error = err;
    });
  }

  // testMethod() {
  //   this.stripeCheckoutService.testMethod('Bk6R0Y8SzsxbJ8ntjtwT').subscribe(res => {
  //     console.log(res);
  //   }, error => console.log(error));
  // }
}
