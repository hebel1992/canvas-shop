import {Injectable} from '@angular/core';
import * as firebase from 'firebase';
import {HttpClient} from '@angular/common/http';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';

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

  testMethod(userData, basket) {
    console.log('service works');
    let userId;

    if (this.user) {
      userId = this.user.uid;
    } else {
      userId = 'NoUser';
    }
    return this.http.post('/api/paypal/test-method', {
      userId,
      userData,
      basket
    });
  }
}
