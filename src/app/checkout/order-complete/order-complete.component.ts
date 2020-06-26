import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {StripeCheckoutService} from '../stripe-checkout.service';

@Component({
  selector: 'app-order-complete',
  templateUrl: './order-complete.component.html',
  styleUrls: ['./order-complete.component.css']
})
export class OrderCompleteComponent implements OnInit {

  waitingMessage = 'Waiting for purchase to complete...';
  resultMessage;
  waiting = true;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private stripeCheckoutService: StripeCheckoutService) {
  }

  ngOnInit(): void {
    const result = this.route.snapshot.queryParamMap.get('purchaseResult');
    if (result === 'success') {
      const sessionId = this.route.snapshot.queryParamMap.get('ongoingSessionId');
      this.stripeCheckoutService.waitForPurchaseCompleted(sessionId).subscribe(() => {
        this.waiting = false;
        this.resultMessage = 'Purchase SUCCESSFUL. Redirecting...';
        setTimeout(() => {
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

}
