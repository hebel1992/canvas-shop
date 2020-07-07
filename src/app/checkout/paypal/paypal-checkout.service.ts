import {Injectable} from '@angular/core';
import * as firebase from 'firebase';
import {HttpClient} from '@angular/common/http';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {RequestBodyItemModel} from '../request-body-item.model';

@Injectable({providedIn: 'root'})
export class PaypalCheckoutService {
  user: firebase.User;

  constructor(private http: HttpClient,
              private auth: AngularFireAuth,
              private db: AngularFirestore) {
    auth.user.subscribe(user => {
      this.user = user;
    });
  }

  createOrder(userData, basket) {
    let userId;

    const requestBodyItems: RequestBodyItemModel[] = [];
    basket.forEach(elem => {
      requestBodyItems.push({id: elem.imageId, quantity: elem.quantity});
    });

    if (this.user) {
      userId = this.user.uid;
    } else {
      userId = 'UserNotRegistered';
    }
    return this.http.post('/api/paypal/create-order', {
      userId,
      userData,
      items: requestBodyItems,
      callbackUrl: this.buildCallbackUrl()
    });
  }

  captureOrder(orderId) {
    return this.http.post('/api/paypal/capture-order', {
      orderId
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
    callbackUrl += '/paypal-redirect';
    return callbackUrl;
  }
}
