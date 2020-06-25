import {Component, OnInit} from '@angular/core';
import {StripeCheckoutService} from './stripe-checkout.service';
import {BasketItemModel} from '../basket/basket-item.model';
import {BasketService} from '../basket/basket-service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  purchaseStarted = false;
  basket: BasketItemModel[];
  basketSubscription: Subscription;
  error: string;

  constructor(private stripeCheckoutService: StripeCheckoutService,
              private basketService: BasketService) {
  }

  ngOnInit(): void {
    this.basket = this.basketService.getBasket();
    this.basketSubscription = this.basketService.basketChanged.subscribe(basket => {
      this.basket = basket;
    });
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

  fullFillTesting() {
    this.stripeCheckoutService.fullFillTesting('Bk6R0Y8SzsxbJ8ntjtwT').subscribe(res => {
      console.log(res);
    }, error => console.log(error));
  }
}
