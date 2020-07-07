import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {StripeCheckoutService} from '../stripe-checkout.service';
import {BasketService} from '../../../basket/basket-service';
import {UserService} from '../../../user/user-service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-order-complete',
  templateUrl: './stripe-redirect-page.compontent.html',
  styleUrls: ['./stripe-redirect-page.component.css']
})
export class StripeRedirectPageCompontent implements OnInit, OnDestroy {
  userSub: Subscription;
  currentUser;
  waitingMessage = 'Waiting for purchase to complete...';
  resultMessage;
  waiting = true;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private stripeCheckoutService: StripeCheckoutService,
              private basketService: BasketService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.userSub = this.userService.userDataChanged.subscribe(user => {
      this.currentUser = user;
    });
    const result = this.route.snapshot.queryParamMap.get('purchaseResult');
    if (result === 'success') {
      const sessionId = this.route.snapshot.queryParamMap.get('ongoingSessionId');
      this.stripeCheckoutService.waitForPurchaseCompleted(sessionId).subscribe(() => {
        this.waiting = false;
        this.resultMessage = 'Purchase SUCCESSFUL. Redirecting...';
        setTimeout(() => {
          if (!this.currentUser) {
            this.basketService.setLocalStorageBasket([]);
          }
          this.router.navigate(['/gallery']);
        }, 3500);
      });
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

}
