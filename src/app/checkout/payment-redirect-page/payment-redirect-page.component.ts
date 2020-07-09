import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CheckoutService} from '../checkout.service';
import {BasketService} from '../../basket/basket-service';
import {UserService} from '../../user/user-service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-order-complete',
  templateUrl: './payment-redirect-page.component.html',
  styleUrls: ['./payment-redirect-page.component.css']
})
export class PaymentRedirectPageComponent implements OnInit, OnDestroy {
  userSub: Subscription;
  currentUser;
  waitingMessage = 'Waiting for purchase to complete...';
  resultMessage;
  waiting = true;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private checkoutService: CheckoutService,
              private basketService: BasketService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.userSub = this.userService.userDataChanged.subscribe(user => {
      this.currentUser = user;
    });

    const result = this.route.snapshot.queryParamMap.get('purchaseResult');
    const stripeSessionId = this.route.snapshot.queryParamMap.get('ongoingSessionId');
    const paypalSessionId = this.route.snapshot.queryParamMap.get('token');

    if (result === 'success') {
      if (stripeSessionId) {
        this.checkoutService.waitForPurchaseCompleted(stripeSessionId).subscribe(() =>
          this.successfulPaymentProcess()
        );
      } else {
        this.checkoutService.captureOrder(paypalSessionId).subscribe(() =>
          this.successfulPaymentProcess()
        );
      }
    } else {
      this.waiting = false;
      this.resultMessage = 'Purchase FAILED or CANCELED. Redirecting...';
      setTimeout(() => {
        this.router.navigate(['/gallery']);
      }, 3500);
    }
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  successfulPaymentProcess() {
    this.waiting = false;
    this.resultMessage = 'Purchase SUCCESSFUL. Redirecting...';
    setTimeout(() => {
      if (this.currentUser) {
        this.basketService.setBasket([]);
      } else {
        this.basketService.setLocalStorageBasket([]);
      }
      this.router.navigate(['/gallery']);
    }, 3500);
  }
}
