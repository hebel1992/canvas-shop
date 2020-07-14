import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BasketItemModel} from '../basket/basket-item.model';
import {Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {filter, first} from 'rxjs/operators';
import * as firebase from 'firebase';
import {environment} from '../../environments/environment';
import {BasketService} from '../basket/basket-service';

declare const Stripe;

interface RequestBodyItemModel {
  id: string;
  quantity: number;
}

interface StripeCheckoutSessionModel {
  stripeCheckoutSessionId: string;
  stripePublicKey: string;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  user: firebase.User;
  basket: BasketItemModel[];

  constructor(private http: HttpClient,
              private auth: AngularFireAuth,
              private db: AngularFirestore,
              private basketService: BasketService) {
    auth.user.subscribe(user => {
      this.user = user;
    });
    this.basket = basketService.getBasket();
    this.basketService.basketChanged.subscribe(basket => {
      this.basket = basket;
    });
  }

  startCheckoutSession(userData, paymentMethod: string, purchaseType: string, imageId: string, qty: number): Observable<any> {
    const requestBodyItems: RequestBodyItemModel[] = [];

    if (purchaseType === 'single') {
      requestBodyItems.push({id: imageId, quantity: qty});
    } else {
      this.basket.forEach(elem => {
        requestBodyItems.push({id: elem.imageId, quantity: elem.quantity});
      });
    }

    let userId;

    if (this.user) {
      userId = this.user.uid;
    } else {
      userId = 'UserNotRegistered';
    }

    const requestBody = {
      userId,
      userData,
      items: requestBodyItems,
      purchaseType,
      callbackUrl: this.buildCallbackUrl()
    };

    if (paymentMethod === 'card') {
      return this.http.post<StripeCheckoutSessionModel>(environment.api.baseUrl + '/api/stripe/checkout', requestBody);
    } else {
      return this.http.post<{ redirect_url: string }>(environment.api.baseUrl + '/api/paypal/create-order', requestBody);
    }
  }

  captureOrder(orderId) {
    return this.http.post<any>(environment.api.baseUrl + '/api/paypal/capture-order', {
      orderId
    });
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

  private buildCallbackUrl(): string {
    const protocol = window.location.protocol;
    const hostName = window.location.hostname;
    const port = window.location.port;

    let callbackUrl = `${protocol}//${hostName}:`;
    if (port) {
      callbackUrl += port;
    }
    return callbackUrl;
  }
}
