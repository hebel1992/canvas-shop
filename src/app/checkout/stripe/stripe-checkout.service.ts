import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BasketItemModel} from '../../basket/basket-item.model';
import {RequestBodyItemModel} from '../request-body-item.model';
import {Observable} from 'rxjs';
import {StripeCheckoutSessionModel} from './stripe-checkout-session.model';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {filter, first} from 'rxjs/operators';
import * as firebase from 'firebase';

declare const Stripe;

@Injectable({
  providedIn: 'root'
})
export class StripeCheckoutService {
  user: firebase.User;

  constructor(private http: HttpClient,
              private auth: AngularFireAuth,
              private db: AngularFirestore) {
    auth.user.subscribe(user => {
      this.user = user;
    });
  }

  startCheckoutSession(userData, basket: BasketItemModel[]): Observable<StripeCheckoutSessionModel> {
    const requestBodyItems: RequestBodyItemModel[] = [];
    basket.forEach(elem => {
      requestBodyItems.push({id: elem.imageId, quantity: elem.quantity});
    });

    let userId;

    if (this.user) {
      userId = this.user.uid;
    } else {
      userId = 'UserNotRegistered';
    }

    return this.http.post<StripeCheckoutSessionModel>('/api/stripe/checkout', {
      userId,
      userData,
      items: requestBodyItems,
      callbackUrl: this.buildCallbackUrl()
    });
  }

  private buildCallbackUrl() {
    const protocol = window.location.protocol;
    const hostName = window.location.hostname;
    const port = window.location.port;

    let callbackUrl = `${protocol}//${hostName}:`;
    if (port) {
      callbackUrl += port;
    }
    callbackUrl += '/stripe-redirect';

    return callbackUrl;
  }

  redirectToCheckout(session: StripeCheckoutSessionModel) {
    const stripe = Stripe(session.stripePublicKey);
    stripe.redirectToCheckout({
      sessionId: session.stripeCheckoutSessionId
    });
  }

  waitForPurchaseCompleted(sessionId: string): Observable<any> {
    return this.db.doc<any>(`purchaseSessions/${sessionId}`)
      .valueChanges()
      .pipe(
        filter(purchase => purchase.status === 'completed'),
        first()
      );
  }
}
