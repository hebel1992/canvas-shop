import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CheckoutService} from '../checkout.service';
import {BasketService} from '../../basket/basket-service';
import {UserService} from '../../user/user-service';
import {Subscription} from 'rxjs';
import {UserDbService} from '../../user/user-db-service';

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
  errorMessage;
  waiting = true;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private checkoutService: CheckoutService,
              private basketService: BasketService,
              private userService: UserService,
              private userDbService: UserDbService) {
  }

  ngOnInit(): void {
    this.userSub = this.userService.userDataChanged.subscribe(user => {
      this.currentUser = user;
    });

    const result = this.route.snapshot.queryParamMap.get('purchaseResult');
    const stripeSessionId = this.route.snapshot.queryParamMap.get('ongoingSessionId');
    const paypalSessionId = this.route.snapshot.queryParamMap.get('token');
    const purchaseType = this.route.snapshot.queryParamMap.get('purchaseType');

    if (result === 'success') {
      if (stripeSessionId) {
        this.checkoutService.waitForPurchaseCompleted(stripeSessionId).subscribe(() =>
          this.successfulPaymentProcess(purchaseType), error =>
          this.errorHandling(error)
        );
      } else {
        this.checkoutService.captureOrder(paypalSessionId).subscribe(res =>
          this.successfulPaymentProcess(purchaseType), error =>
          this.errorHandling(error)
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

  successfulPaymentProcess(purchaseType: string) {
    if (this.currentUser) {
      this.userDbService.fetchUserPurchaseHistory(this.currentUser.id).catch(err => {
        this.errorMessage = err.error.message;
      });
    }
    this.waiting = false;
    this.resultMessage = 'Purchase SUCCESSFUL. Redirecting...';
    setTimeout(() => {
      if (purchaseType && purchaseType === 'multiple') {
        if (this.currentUser) {
          this.basketService.setBasket([]);
        } else {
          this.basketService.setLocalStorageBasket([]);
        }
      }
      this.router.navigate(['/gallery']);
    }, 3500);
  }

  errorHandling(error) {
    this.errorMessage = error.error.message;
    setTimeout(() => {
      this.router.navigate(['/gallery']);
    }, 3500);
  }
}
