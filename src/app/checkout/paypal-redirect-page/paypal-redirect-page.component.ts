import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {UserService} from '../../user/user-service';
import {BasketService} from '../../basket/basket-service';
import {CheckoutService} from '../checkout.service';

@Component({
  selector: 'app-paypal-redirect-page',
  templateUrl: './paypal-redirect-page.component.html',
  styleUrls: ['./paypal-redirect-page.component.css']
})
export class PaypalRedirectPageComponent implements OnInit, OnDestroy {
  userSub: Subscription;
  currentUser;
  waitingMessage = 'Waiting for purchase to complete...';
  resultMessage;
  waiting = true;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private stripeCheckoutService: CheckoutService,
              private basketService: BasketService) {
  }

  ngOnInit(): void {
    this.userSub = this.userService.userDataChanged.subscribe(user => {
      this.currentUser = user;
    });
    const result = this.route.snapshot.queryParamMap.get('purchaseResult');

    if (result === 'success') {
      const orderId = this.route.snapshot.queryParamMap.get('token');
      this.stripeCheckoutService.captureOrder(orderId).subscribe(() => {
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
