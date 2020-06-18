import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {UserService} from '../user/user-service';
import {BasketService} from '../basket/basket-service';
import * as firebase from 'firebase';
import {AngularFirestore} from '@angular/fire/firestore';
import {UserDbService} from '../user/user-db-service';
import {BasketItemModel} from '../basket/basket-item.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: AngularFireAuth,
              private router: Router,
              private userService: UserService,
              private basketService: BasketService,
              private db: AngularFirestore,
              private userDbService: UserDbService) {
  }

  login(email: string, password: string) {
    const session = firebase.auth.Auth.Persistence.SESSION;
    return this.auth.setPersistence(session).then(() => {
      return this.auth.signInWithEmailAndPassword(email, password).then(() => {
        this.basketService.destroyLocalStorageBasket();
      });
    });
  }

  async register(email: string, password: string) {
    const session = firebase.auth.Auth.Persistence.SESSION;

    try {
      await this.auth.setPersistence(session);
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      await this.createUserProfile(userCredential);
    } catch (err) {
      throw new Error(err);
    }
  }

  logout() {
    return this.auth.signOut().then(() => {
      this.router.navigate(['/']);
      this.userService.setUserData(null);
    });
  }

  resetPassword(email: string) {
    return this.auth.sendPasswordResetEmail(email);
  }

  private async createUserProfile(cred: firebase.auth.UserCredential) {
    try {
      const userRef = await this.db.collection('users').doc(cred.user.uid).ref.get();

      if (!userRef.exists) {
        let localBasket: BasketItemModel[] = [];
        if (localStorage.getItem('basket')) {
          localBasket = JSON.parse(localStorage.getItem('basket'));
          localStorage.removeItem('basket');
        }
        await this.db.collection('users').doc(cred.user.uid).set({
          id: cred.user.uid,
          firstName: '',
          lastName: '',
          email: cred.user.email,
          phone: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          postCode: '',
          county: '',
          basket: localBasket,
          shoppingHistory: []
        });
      } else {
        localStorage.removeItem('basket');
      }
      await this.userDbService.fetchUserData(cred.user.uid);
    } catch (err) {
      throw new Error(err);
    }
  }
}
